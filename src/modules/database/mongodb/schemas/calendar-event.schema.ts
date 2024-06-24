import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IJwtPayload } from 'src/interfaces';

export type CalendarEventDocument = HydratedDocument<CalendarEvent>;

@Schema()
export class CalendarEvent {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    category: string;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Map, of: mongoose.Schema.Types.Mixed })
    createdBy: IJwtPayload;

    @Prop({
        default: []
    })
    attendees: number[];

    @Prop({
        default: '* * * * * *',
        validate: {
            validator: (value: string) => {
                return value.split(' ').length - 1 === 5;
            },
            message: 'Invalid Event schema'
        }
    })
    schema: string
}

export const CalendarEventSchema = SchemaFactory.createForClass(CalendarEvent);