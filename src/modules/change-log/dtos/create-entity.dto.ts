import { EntityTypeEnum } from "../libs/entity-type.enum";

export class CreateEntityDto {
    entityId: number;
    entityName: string;
    entityType: EntityTypeEnum;
}