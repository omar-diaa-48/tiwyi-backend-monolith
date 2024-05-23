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
    let project = await this.database.project.findFirst({
      where: {
        creatorId: user.userId,
        corporateId: corporate.id,
      }
    })

    if (!project) {
      project = await this.database.project.create({
        data: {
          title: 'Custom',
          description: 'Custom project auto created',
          creatorId: user.userEntityId,
          corporateId: corporate.id,
          expectedEnd: null,
        }
      })

      const projectPreference = await this.database.projectPreference.create({ data: { ...this.projectPreferenceService.generateDefaultItem({ projectId: project.id }) } })
    }
  }

  async listenToReadUserProjectsTopic(user: IJwtPayload) {
    const userEmployeeIds = await this.database.employee.findMany({ where: { userId: user.userEntityId }, select: { id: true } })

    return this.database.project.findMany({
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
        worksheets: true
      }
    })

    return workspaces;
  }

  async listenToCreateUserWorkspaceTopic(user: IJwtPayload, dto: any) {
    return this.database.workspace.create({
      data: {
        title: dto.title,
        description: dto.description,
        budget: dto.budget,
        project: {
          connect: {
            id: dto.projectId
          }
        }
      }
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
      }
    })
  }

  async validateUserProject(user: IJwtPayload, projectId: number) { }
}
