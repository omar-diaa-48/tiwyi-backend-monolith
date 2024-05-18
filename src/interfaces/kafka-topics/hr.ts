import { ICreateUserCorporatePayload } from "../payload.interface";
import { ITopic } from "../topic.interface";

// TOPICS
export interface ICreateUserCorporateTopic extends ITopic<ICreateUserCorporatePayload, void> { }
