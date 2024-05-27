import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CorporateType, DepartmentType } from "@prisma/client";
import { IJwtPayload } from "src/interfaces";
import { DatabaseService } from "../database/database.service";
import { WorkmatiqMsService } from "../workmatiq/workmatiq-ms.service";

@Injectable()
export class HrMsService {
  constructor(
    private configService: ConfigService,
    private database: DatabaseService,

    private readonly workmatiqMsService: WorkmatiqMsService
  ) { }

  async listenToUserCreatedTopic(userEntity: IJwtPayload) {
    const corporateTitle = `${userEntity.email} corporate`;

    let corporate = await this.database.corporate.findFirst({
      where: {
        title: corporateTitle,
        corporateType: CorporateType.PERSONAL
      }
    })

    if (!corporate) {
      corporate = await this.database.corporate.create({
        data: {
          title: `${userEntity.email} corporate`,
          description: `${userEntity.email} corporate`,
          corporateType: CorporateType.PERSONAL,
        }
      })

      const department = await this.database.department.create({
        data: {
          title: 'Custom',
          description: 'Custom department auto created',
          corporateId: corporate.id,
          departmentType: DepartmentType.DEFAULT,
        }
      })

      await this.database.employee.create({
        data: {
          userId: userEntity.userEntityId,
          departmentId: department.id,
        }
      })
    }

    await this.workmatiqMsService.listenToUserCorporateCreatedTopic(userEntity, corporate)
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
