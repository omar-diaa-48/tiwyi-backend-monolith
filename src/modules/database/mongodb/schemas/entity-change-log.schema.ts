import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EntityTypeEnum } from 'src/modules/change-log/libs/entity-type.enum';

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
}

export const EntityChangeLogSchema = SchemaFactory.createForClass(EntityChangeLog);