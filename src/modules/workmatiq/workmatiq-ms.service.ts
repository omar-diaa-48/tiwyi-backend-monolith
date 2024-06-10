import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Member, Prisma, PrismaClient, ProjectTag, StatusListType, Task } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"
import { ExtendedTask } from "prisma/types"
import { IJwtPayload } from "src/interfaces"
import { ICreateUserCorporateTopic } from "src/interfaces/kafka-topics/hr"
import { PayloadType } from "src/interfaces/topic.interface"
import { ChangeLogService } from "../change-log/change-log.service"
import { ChangeTypeEnum } from "../change-log/libs/change-type.enum"
import { EntityTypeEnum } from "../change-log/libs/entity-type.enum"
import { DatabaseService } from "../database/database.service"
import { StorageService } from "../storage/storage.service"
import { TASK_BOARD_CARD_INCLUDES, TASK_BOARD_COLUMN_INCLUDES } from "./libs/prisma.includes"
import { ProjectPreferenceService } from "./services/project-preference.service"

@Injectable()
export class WorkmatiqMsService {
  constructor(
    private database: DatabaseService,
    private configService: ConfigService,
    private storageService: StorageService,
    private changeLogService: ChangeLogService,

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
        members: {
          include: {
            userEntity: true
          }
        },
        tags: true
      }
    })
  }

  async listenToCreateUserProjectTagTopic(user: IJwtPayload, id: number, dto: any) {
    return this.database.projectTag.create({
      data: {
        projectId: id,
        content: dto.content,
        color: dto.color,
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
            tasks: {
              include: TASK_BOARD_COLUMN_INCLUDES,
              where: {
                isArchived: false
              }
            },
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
    return this.database.$transaction(async (tx) => {
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

        await this.changeLogService.createLog(dto.projectId, { entityId: workspace.id, entityName: workspace.title, entityType: EntityTypeEnum.WORKSPACE, changeType: ChangeTypeEnum.CREATE, newState: {} })

        return workspace
      })

      return workspace;
    })
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
    return this.database.$transaction(async (tx) => {
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

      const worksheet = await this.database.worksheet.create({
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

      await this.changeLogService.createLog(dto.projectId, { entityId: worksheet.id, entityName: worksheet.title, entityType: EntityTypeEnum.WORKSHEET, changeType: ChangeTypeEnum.CREATE, newState: {} })

      return worksheet
    })

  }

  async listenToPatchUserWorksheetTopic(user: IJwtPayload, id: number, dto: any) {
    return this.database.worksheet.update({
      where: {
        id
      },
      data: dto,
      include: {
        tasks: {
          include: TASK_BOARD_COLUMN_INCLUDES
        },
        statusList: true
      }
    })
  }

  async listenToCreateUserWorksheetTaskTopic(user: IJwtPayload, dto: any) {
    const task = await this.database.$transaction(async (tx) => {

      const worksheet = await tx.worksheet.findFirst({
        where: {
          id: dto.worksheetId
        },
        select: {
          id: true,
          workspaceId: true,
          workspace: {
            select: {
              projectId: true
            }
          }
        }
      })

      let task = await tx.task.create({
        data: {
          title: dto.title,
          description: dto.description,
          worksheetId: worksheet.id,
          workspaceId: worksheet.workspaceId,
          projectId: worksheet.workspace.projectId,
          createdById: user.userEntityId,
        },
      })

      await tx.taskMember.createMany({
        data: (dto.members || []).map((member) => ({ taskId: task.id, memberId: member.id })),
        skipDuplicates: true,
      })

      await this.hydrateTask(task.id, { members: dto.members, projectTags: dto.projectTags }, tx)

      task = await tx.task.findFirst({
        where: {
          id: task.id,
        },
        include: TASK_BOARD_COLUMN_INCLUDES
      })

      await this.changeLogService.createLog(task.projectId, { entityId: task.id, entityName: task.title, entityType: EntityTypeEnum.TASK, changeType: ChangeTypeEnum.CREATE, newState: {} })

      return task;
    })

    return task
  }

  async listenToPatchUserWorksheetTaskTopic(user: IJwtPayload, id: number, dto: any) {
    const task = await this.database.$transaction(async (tx) => {
      let task = await tx.task.findFirstOrThrow({
        where: {
          id
        },
        include: TASK_BOARD_COLUMN_INCLUDES
      })

      let updateObj = {}

      for (const field in dto) {
        if (field in task) {
          updateObj[field] = dto[field]
        }
      }

      if (Object.keys(updateObj).length > 0) {
        task = await tx.task.update({
          where: {
            id
          },
          data: updateObj,
          include: TASK_BOARD_COLUMN_INCLUDES
        })
      }

      await this.hydrateTask(task.id, { members: dto.members, projectTags: dto.projectTags }, tx)

      await this.changeLogService.createLog(task.projectId, { entityId: task.id, entityName: task.title, entityType: EntityTypeEnum.TASK, changeType: ChangeTypeEnum.UPDATE, newState: task })

      return task;
    })

    return task
  }

  async listenToReadUserWorksheetTaskTopic(user: IJwtPayload, id: number) {
    const task = await this.database.task.findUniqueOrThrow({
      where: {
        id
      },
      include: TASK_BOARD_CARD_INCLUDES
    })

    const logs = await this.changeLogService.getLogs(task.id, EntityTypeEnum.TASK)

    const data: ExtendedTask = Object.assign({}, task, { logs })

    return data;
  }

  async listenToPatchUserWorksheetTaskAttachmentsTopic(user: IJwtPayload, id: number, attachments: Array<Express.Multer.File>): Promise<Task> {
    await Promise.all(attachments.map(async (attachment) => {
      const [attachmentUrl, thumbnailUrl] = await this.storageService.uploadAttachment(attachment)

      const taskAttachment = await this.database.taskAttachment.create({
        data: { taskId: id, url: attachmentUrl }
      })

      const attachmentThumbnail = await this.database.attachmentThumbnail.create({
        data: { attachmentId: taskAttachment.id, url: thumbnailUrl }
      })


      return {
        taskAttachment,
        attachmentThumbnail
      }
    }))

    return this.database.task.findFirstOrThrow({
      where: {
        id
      },
      include: TASK_BOARD_COLUMN_INCLUDES
    })
  }

  async listenToDeleteUserWorksheetTaskTopic(user: IJwtPayload, id: number) {
    return this.database.task.update({
      where: {
        id
      },
      data: {
        isArchived: true
      }
    })
  }

  async hydrateTask(taskId: number, data?: { members?: Array<Member>, projectTags?: Array<ProjectTag> }, tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) {
    if (!tx) {
      tx = this.database;
    }

    if (data.members && data.members.length > 0) {
      await tx.taskMember.deleteMany({ where: { taskId } })
      await tx.taskMember.createMany({
        data: (data.members || []).map((member) => ({ taskId, memberId: member.id })),
        skipDuplicates: true,
      })
    }

    if (data.projectTags && data.projectTags.length > 0) {
      await tx.taskTag.deleteMany({ where: { taskId } })

      await tx.taskTag.createMany({
        data: data.projectTags.map((projectTag: ProjectTag) => ({ taskId: taskId, projectTagId: projectTag.id }))
      })
    }
  }

  async validateUserProject(user: IJwtPayload, projectId: number) { }
}
