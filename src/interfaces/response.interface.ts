import { EntityTypeEnum } from "src/modules/change-log/libs/entity-type.enum";
import { IUser } from "./base.interface";

export interface ICreateUserResponse extends IUser { }

export interface IProjectOverviewResponse {
    count: number;
    category: EntityTypeEnum;
    projectId: number;
}