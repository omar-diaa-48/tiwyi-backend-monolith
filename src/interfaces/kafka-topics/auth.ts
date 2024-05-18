import { IUser } from "../base.interface";
import { ICreateUserPayload } from "../payload.interface";
import { ICreateUserResponse } from "../response.interface";
import { ITopic } from "../topic.interface";

// TOPICS
export interface ICreateUserTopic extends ITopic<ICreateUserPayload, ICreateUserResponse> { }
export interface ISignInUserTopic extends ITopic<IUser, IUser> { }