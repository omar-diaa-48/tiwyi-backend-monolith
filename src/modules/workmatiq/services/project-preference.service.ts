import { Injectable } from "@nestjs/common";
import { $Enums, Currency, ProjectPreference } from "@prisma/client";
import { IHasGenerateDefaultItem } from '../../base/base.service.interface';

@Injectable()
export class ProjectPreferenceService implements IHasGenerateDefaultItem<ProjectPreference> {
    generateDefaultItem(args: any): Omit<{ id: number; currency: $Enums.Currency; projectId: number; }, "id"> {
        return {
            currency: Currency.EURO,
            projectId: args.projectId
        }
    }
}