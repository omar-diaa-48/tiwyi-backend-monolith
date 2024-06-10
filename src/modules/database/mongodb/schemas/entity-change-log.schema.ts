import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ChangeLog } from './change-log.schema';

export type EntityChangeLogDocument = HydratedDocument<EntityChangeLog>;

@Schema()
export class EntityChangeLog {
    @Prop()
    entityId: string;

    @Prop()
    entityName: string;

    @Prop()
    entityType: string;

    @Prop()
    entityProjectId: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: ChangeLog.name }] })
    changeLogs: ChangeLog[];
}

export const EntityChangeLogSchema = SchemaFactory.createForClass(EntityChangeLog);