import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IJwtPayload } from "src/interfaces";
import { IProjectOverviewResponse } from "src/interfaces/response.interface";
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
        dto: CreateLogDto,
        user: IJwtPayload
    ) {
        const { changeType, newState } = dto;
        let entityChangeLog = await this.entityChangeLogModel.findOne({ entityId: dto.entityId, entityType: dto.entityType });

        if (!entityChangeLog) {
            entityChangeLog = await this.createEntity(projectId, dto);
        }

        const usedNewState = {}

        for (const key in newState) {
            if (!(['function', 'symbol', 'undefined'].includes(typeof newState[key]))) {
                usedNewState[key] = newState[key];
            }
        }

        return this.changeLogModel.create({ changeType, newState: usedNewState, entityChangeLog, changeMaker: user, });
    }

    async getLogs(
        entityId: number,
        entityType: EntityTypeEnum
    ) {
        const entityChangeLog = await this.entityChangeLogModel.findOne({ entityId, entityType });

        if (!entityChangeLog) {
            return [];
        }

        return this.changeLogModel.find({ entityChangeLog }, null, { sort: { createdAt: -1 } });
    }

    async getOverview(projectIds: number[]): Promise<Array<IProjectOverviewResponse>> {
        const categoryCounts = await this.changeLogModel.aggregate<IProjectOverviewResponse>([
            {
                $lookup: {
                    from: this.entityChangeLogModel.collection.name,
                    localField: "entityChangeLog",
                    foreignField: "_id",
                    as: "entityChangeLogDetails"
                }
            },
            {
                $unwind: "$entityChangeLogDetails"
            },
            { $match: { "entityChangeLogDetails.entityProjectId": { $in: projectIds } } },
            { $group: { _id: { projectId: "$entityChangeLogDetails.entityProjectId", category: "$entityChangeLogDetails.entityType" }, count: { $sum: 1 } } },
            { $project: { _id: 0, category: "$_id.category", count: 1, projectId: "$_id.projectId" } }
        ]);

        return categoryCounts;
    }
}