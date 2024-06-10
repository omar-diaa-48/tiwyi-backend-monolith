import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { EntityChangeLog } from './entity-change-log.schema';

export type ChangeLogDocument = HydratedDocument<ChangeLog>;

@Schema()
export class ChangeLog {
    @Prop({ type: Map, of: mongoose.Schema.Types.Mixed })
    newState: Record<string, any>;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EntityChangeLog' })
    @Type(() => EntityChangeLog)
    entityChangeLog: EntityChangeLog;
}

export const ChangeLogSchema = SchemaFactory.createForClass(ChangeLog);