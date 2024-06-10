import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EntityTypeEnum } from 'src/modules/change-log/libs/entity-type.enum';
import { ChangeLog } from './change-log.schema';

export type EntityChangeLogDocument = HydratedDocument<EntityChangeLog>;

@Schema()
export class EntityChangeLog {
    @Prop()
    entityId: number;

    @Prop()
    entityName: string;

    @Prop()
    entityProjectId: number;

    @Prop({ type: String, enum: EntityTypeEnum })
    entityType: EntityTypeEnum;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChangeLog' }] })
    changeLogs: ChangeLog[];
}

export const EntityChangeLogSchema = SchemaFactory.createForClass(EntityChangeLog);