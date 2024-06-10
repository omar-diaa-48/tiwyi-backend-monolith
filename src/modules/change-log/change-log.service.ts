import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChangeLog } from "../database/mongodb/schemas/change-log.schema";
import { EntityChangeLog } from "../database/mongodb/schemas/entity-change-log.schema";
import { CreateEntityDto } from "./dtos/create-entity.dto";
import { CreateLogDto } from "./dtos/create-log.dto";
import { EntityTypeEnum } from "./libs/entity-type.enum";

@Injectable()
export class ChangeLogService {
    constructor(
        @InjectModel(EntityChangeLog.name) private readonly entityChangeLogModel: Model<EntityChangeLog>,
        @InjectModel(ChangeLog.name) private readonly changeLogModel: Model<ChangeLog>,
    ) { }

    async createEntity(
        projectId: number,
        dto: CreateEntityDto
    ) {
        const { entityId, entityName, entityType } = dto;
        return this.entityChangeLogModel.create({ entityId, entityName, entityType, entityProjectId: projectId });
    }

    async createLog(
        projectId: number,
        dto: CreateLogDto
    ) {
        const { changeType, newState } = dto;
        let entityChangeLog = await this.entityChangeLogModel.findOne({ entityId: dto.entityId, entityType: dto.entityType });

        if (!entityChangeLog) {
            entityChangeLog = await this.createEntity(projectId, dto);
        }

        const usedNewState = {}

        for (const key in newState) {
            if (!(['function', 'object', 'symbol', 'undefined'].includes(typeof newState[key]))) {
                usedNewState[key] = newState[key];
            }
        }

        return this.changeLogModel.create({ changeType, newState: usedNewState, entityChangeLog });
    }

    async getLogs(
        entityId: number,
        entityType: EntityTypeEnum
    ) {
        const entityChangeLog = await this.entityChangeLogModel.findOne({ entityId, entityType });

        if (!entityChangeLog) {
            return [];
        }

        return this.changeLogModel.find({ entityChangeLog });
    }
}