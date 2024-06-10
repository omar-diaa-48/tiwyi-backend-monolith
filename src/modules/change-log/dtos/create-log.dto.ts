import { ChangeTypeEnum } from "../libs/change-type.enum";
import { CreateEntityDto } from "./create-entity.dto";

export class CreateLogDto extends CreateEntityDto {
    newState: Record<string, any>;
    changeType: ChangeTypeEnum;
}