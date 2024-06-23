import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CalendarEvent, CalendarEventSchema } from "../database/mongodb/schemas/calendar-event.schema";
import { CalendarEventService } from "./calendar-event.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CalendarEvent.name, schema: CalendarEventSchema },
        ]),
    ],
    controllers: [],
    providers: [CalendarEventService],
    exports: [CalendarEventService]
})
export class CalendarModule { }