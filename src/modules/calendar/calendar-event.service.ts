import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJwtPayload } from 'src/interfaces';
import { CalendarEvent } from 'src/modules/database/mongodb/schemas/calendar-event.schema';

@Injectable()
export class CalendarEventService {
    constructor(
        @InjectModel(CalendarEvent.name) private readonly calendarEventModel: Model<CalendarEvent>,
    ) { }

    getEvents(user: IJwtPayload, dto: any): Promise<Array<CalendarEvent>> {
        const [year, month] = dto.schema.split(' ');

        const schema = this.buildSchemaRegex(year, month)

        return this.calendarEventModel.find({
            $and: [
                {
                    $or: [
                        { 'createdBy.id': user.userEntityId },
                        {
                            attendees: {
                                $in: [user.userEntityId]
                            }
                        }
                    ]
                },
                ...(dto.categories && dto.categories.length ? [{ category: { $in: dto.categories } }] : []),
                {
                    schema: {
                        $regex: schema
                    }
                }
            ]
        });
    }

    buildSchemaRegex(year: string, month: string) {
        // This function builds a regex to match schema strings
        // that have "*" or a specific value in the second part (month).
        // It covers patterns like "* * month * * *", "year month day * * *", "year month day hour minute second".
        return new RegExp(`^(${year}|\\*) (${month}|\\*) ([1-9]|1[0-9]|2[0-9]|3[01]|\\*) ([0-9]|1[0-9]|2[0-3]|\\*) ([0-5]?[0-9]|\\*) ([0-5]?[0-9]|\\*)$`);
        // return new RegExp(`^(\d{4}|\\*) ([1-9]|1[0-2]|\\*) ([1-9]|1[0-9]|2[0-9]|3[01]|\\*) ([0-9]|1[0-9]|2[0-3]|\\*) ([0-5]?[0-9]|\\*) ([0-5]?[0-9]|\\*)$`);
    };
}