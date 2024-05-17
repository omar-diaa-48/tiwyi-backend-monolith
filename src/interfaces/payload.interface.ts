import { IUser } from "./base.interface";

export interface ICreateUserPayload extends IUser { }

export interface ICreateUserCorporatePayload {
    user: IUser & { id: number },
    corporate: any
}