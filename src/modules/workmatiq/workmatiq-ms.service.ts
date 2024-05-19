import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ICreateUserCorporateTopic } from "src/interfaces/kafka-topics/hr"
import { PayloadType } from "src/interfaces/topic.interface"
import { DatabaseService } from "../database/database.service"
import { ProjectPreferenceService } from "./services/project-preference.service"

@Injectable()
export class WorkmatiqMsService {
  constructor(
    private configService: ConfigService,
    private database: DatabaseService,

    private projectPreferenceService: ProjectPreferenceService
  ) { }

  async listenToUserCorporateCreatedTopic(user: ICreateUserCorporateTopic[PayloadType]["user"], corporate: ICreateUserCorporateTopic[PayloadType]["corporate"]) {
    let project = await this.database.project.findFirst({
      where: {
        creatorId: user.id,
        corporateId: corporate.id,
      }
    })

    if (!project) {
      project = await this.database.project.create({
        data: {
          title: 'Custom',
          description: 'Custom project auto created',
          creatorId: user.id,
          corporateId: corporate.id,
          expectedEnd: null,
        }
      })

      const projectPreference = await this.database.projectPreference.create({ data: { ...this.projectPreferenceService.generateDefaultItem({ projectId: project.id }) } })
    }

  }
}
