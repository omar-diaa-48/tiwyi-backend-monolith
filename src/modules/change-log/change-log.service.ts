import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChangeLog } from "../database/mongodb/schemas/change-log.schema";
import { EntityChangeLog } from "../database/mongodb/schemas/entity-change-log.schema";

@Injectable()
export class ChangeLogService {
    constructor(
        @InjectModel(EntityChangeLog.name) private readonly entityChangeLog: Model<EntityChangeLog>,
        @InjectModel(ChangeLog.name) private readonly changeLogModel: Model<ChangeLog>,
    ) { }
}