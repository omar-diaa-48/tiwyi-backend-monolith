import { IHasEmail, IHasToken } from "./base.interface";

export interface IJwtPayload extends IHasEmail, IHasToken {
    userId: number;
    userEntityId: number;
}