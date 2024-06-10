import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChangeLog, ChangeLogSchema } from "../database/mongodb/schemas/change-log.schema";
import { EntityChangeLog, EntityChangeLogSchema } from "../database/mongodb/schemas/entity-change-log.schema";
import { ChangeLogService } from "./change-log.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ChangeLog.name, schema: ChangeLogSchema },
            { name: EntityChangeLog.name, schema: EntityChangeLogSchema },
        ]),
    ],
    providers: [ChangeLogService],
    exports: [ChangeLogService]
})
export class ChangeLogModule { }