import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { StatusListType } from "@prisma/client"
import { IJwtPayload } from "src/interfaces"
import { ICreateUserCorporateTopic } from "src/interfaces/kafka-topics/hr"
import { PayloadType } from "src/interfaces/topic.interface"
import { DatabaseService } from "../database/database.service"
import { ProjectPreferenceService } from "./services/project-preference.service"

@Injectable()
export class WorkmatiqMsService {
  constructor(
    private configService: ConfigService,
    private database: DatabaseService,

    private projectPreferenceService: ProjectPreferenceService,
  ) { }

  async listenToUserCorporateCreatedTopic(user: IJwtPayload, corporate: ICreateUserCorporateTopic[PayloadType]["corporate"]) {
    await this.database.$transaction(async (tx) => {
      let project = await tx.project.findFirst({
        where: {
          creatorId: user.userId,
          corporateId: corporate.id,
        }
      })

      if (!project) {
        project = await tx.project.create({
          data: {
            title: 'Custom',
            description: 'Custom project auto created',
            creatorId: user.userEntityId,
            corporateId: corporate.id,
            expectedEnd: null,
          }
        })

        await tx.projectPreference.create({ data: { ...this.projectPreferenceService.generateDefaultItem({ projectId: project.id }) } })

        const team = await tx.team.create({
          data: {
            title: 'Custom',
            description: 'Custom team auto created',
            type: 'CUSTOM',
            roleId: 1,
            project: {
              connect: { id: project.id }
            }
          }
        })

        const employee = await tx.employee.findFirst({
          where: {
            userId: user.userEntityId
          }
        })

        await tx.member.create({
          data: {
            userEntity: {
              connect: {
                id: user.userEntityId
              }
            },
            team: {
              connect: {
                id: team.id
              }
            },
            project: {
              connect: {
                id: project.id
              }
            },
            employeeId: employee.id
          }
        })
      }
    })
  }

  async listenToReadUserProjectsTopic(user: IJwtPayload) {
    const userEmployeeIds = await this.database.employee.findMany({ where: { userId: user.userEntityId }, select: { id: true } })

    return this.database.project.findMany({
      where: {
        OR: [
          {
            teams: {
              some: {
                members: {
                  some: {
                    employeeId: {
                      in: userEmployeeIds.map((item) => item.id)
                    }
                  }
                }
              }
            }
          },
          {
            creatorId: user.userEntityId
          }
        ]
      },
      include: {
        statusLists: true,
        teams: true,
        _count: {
          select: {
            members: true
          }
        }
      }
    })
  }

  async listenToReadUserWorkspacesTopic(user: IJwtPayload) {
    const userEmployeeIds = await this.database.employee.findMany({ where: { userId: user.userEntityId }, select: { id: true } })

    const projects = await this.database.project.findMany({
      where: {
        teams: {
          every: {
            members: {
              every: {
                employeeId: {
                  in: userEmployeeIds.map((item) => item.id)
                }
              }
            }
          }
        }
      },
      select: {
        id: true
      },
    })

    const workspaces = await this.database.workspace.findMany({
      where: {
        projectId: {
          in: projects.map((project) => project.id)
        }
      },
      include: {
        worksheets: {
          include: {
            tasks: true,
            statusList: true
          }
        },
        workspaceMembers: {
          include: {
            member: {
              include: {
                userEntity: true
              }
            }
          }
        }
      }
    })

    return workspaces;
  }

  async listenToCreateUserWorkspaceTopic(user: IJwtPayload, dto: any) {
    const workspace = await this.database.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          title: dto.title,
          description: dto.description,
          budget: dto.budget,
          project: {
            connect: {
              id: dto.projectId
            }
          }
        },
        include: {
          worksheets: {
            include: {
              tasks: true,
              statusList: true
            }
          },
          workspaceMembers: {
            include: {
              member: {
                include: {
                  userEntity: true
                }
              }
            }
          }
        }
      })

      const member = await tx.member.findFirst({
        where: {
          userId: user.userEntityId
        }
      })

      const workspaceMember = await tx.workspaceMember.create({
        data: {
          member: {
            connect: {
              id: member.id
            }
          },
          workspace: {
            connect: {
              id: workspace.id
            }
          }
        }
      })

      return workspace
    })

    return workspace;
  }

  async listenToDeleteUserWorkspaceTopic(user: IJwtPayload, id: number) {
    await this.database.worksheet.deleteMany({
      where: {
        workspaceId: id
      }
    })

    return this.database.workspace.delete({
      where: {
        id
      },
    })
  }

  async listenToCreateUserWorksheetTopic(user: IJwtPayload, dto: any) {
    let defaultStatusList = await this.database.statusList.findFirst({
      where: {
        AND: {
          projectId: dto.projectId,
          statusListType: StatusListType.DEFAULT
        }
      }
    })

    if (!defaultStatusList) {
      defaultStatusList = await this.database.statusList.create({
        data: {
          statusListType: StatusListType.DEFAULT,
          projectId: dto.projectId
        }
      })
    }

    return this.database.worksheet.create({
      data: {
        title: dto.title,
        description: dto.description,
        statusList: {
          connect: {
            id: defaultStatusList.id
          }
        },
        workspace: {
          connect: {
            id: dto.workspaceId
          }
        }
      },
      include: {
        tasks: true,
        statusList: true
      }
    })
  }

  async listenToCreateUserWorksheetTaskTopic(user: IJwtPayload, dto: any) {
    return this.database.task.create({
      data: {
        content: dto.content,
        worksheetId: dto.worksheetId,
        createdById: user.userEntityId,
      }
    })
  }

  async validateUserProject(user: IJwtPayload, projectId: number) { }
}
