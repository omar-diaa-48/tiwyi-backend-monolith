import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CorporateType, DepartmentType } from "@prisma/client";
import { IJwtPayload } from "src/interfaces";
import { ICreateUserTopic } from "src/interfaces/kafka-topics/auth";
import { PayloadType } from "src/interfaces/topic.interface";
import { DatabaseService } from "../database/database.service";
import { WorkmatiqMsService } from "../workmatiq/workmatiq-ms.service";

@Injectable()
export class HrMsService {
  constructor(
    private configService: ConfigService,
    private database: DatabaseService,

    private readonly workmatiqMsService: WorkmatiqMsService
  ) { }

  async listenToUserCreatedTopic(user: ICreateUserTopic[PayloadType]) {
    const corporateTitle = `${user.email} corporate`;

    let corporate = await this.database.corporate.findFirst({
      where: {
        title: corporateTitle,
        corporateType: CorporateType.PERSONAL
      }
    })

    if (!corporate) {
      corporate = await this.database.corporate.create({
        data: {
          title: `${user.email} corporate`,
          description: `${user.email} corporate`,
          corporateType: CorporateType.PERSONAL,
        }
      })

      const department = await this.database.department.create({
        data: {
          corporateId: corporate.id,
          departmentType: DepartmentType.DEFAULT,
          title: 'Custom',
          description: 'Custom department auto created',
        }
      })
    }

    await this.workmatiqMsService.listenToUserCorporateCreatedTopic(user, corporate)
  }

  async listenToReadUserCorporatesTopic(user: IJwtPayload) {
    const userEntityEmployees = await this.database.employee.findMany({
      where: {
        userId: user.userEntityId
      },
      select: {
        departmentId: true
      }
    })

    if (!userEntityEmployees.length) {
      return []
    }

    const departments = await this.database.department.findMany({
      where: {
        id: {
          in: userEntityEmployees.map((item) => item.departmentId)
        }
      },
      select: {
        corporateId: true
      }
    })

    if (!departments.length) {
      return []
    }

    const corporates = await this.database.corporate.findMany({
      where: {
        id: {
          in: departments.map((item) => item.corporateId)
        }
      }
    })

    return corporates;
  }
}
