import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJwtPayload } from 'src/interfaces';
import { CalendarEvent } from 'src/modules/database/mongodb/schemas/calendar-event.schema';

@Injectable()
export class CalendarEventService {
    DEFAULT_YEAR_REGEX = "(?:\\*(?: .*)?|(?:.*,)?\\d{4}(?:,.*)?)"
    DEFAULT_MONTH_REGEX = "(?:\\*(?: .*)?|(?:.*,)?\\d{1,2}(?:,.*)?)"

    constructor(
        @InjectModel(CalendarEvent.name) private readonly calendarEventModel: Model<CalendarEvent>,
    ) { }

    getEvents(user: IJwtPayload, dto: any): Promise<Array<CalendarEvent>> {
        const [year, month] = dto.schema.split(' ');

        const schema = this.buildSchemaRegex(this.buildYearSchemaQueryRegex(year), this.buildMonthSchemaQueryRegex(month))

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
                {
                    schema: {
                        $regex: schema
                    }
                },
                ...(dto.categories && dto.categories.length ? [{ category: { $in: dto.categories } }] : []),
            ]
        });
    }

    createEvent(user: IJwtPayload, dto: any): Promise<CalendarEvent> {
        const isValidSchema = this.buildSchemaRegex(this.DEFAULT_YEAR_REGEX, this.DEFAULT_MONTH_REGEX);

        if (!isValidSchema.test(dto.schema)) {
            throw new Error('Invalid event schema');
        }

        return this.calendarEventModel.create({
            ...dto,
            createdBy: user
        });
    }

    buildSchemaRegex(year?: string, month?: string) {
        // This function builds a regex to match schema strings
        // that have "*" or a specific value in the second part (month).
        // It covers patterns like "* * month * * *", "year month day * * *", "year month day hour minute second".
        return new RegExp(`^${year} ${month} (?:\\d{1,2}(?:,\\d{1,2})*|\\*) (?:\\d{1,2}(?:,\\d{1,2})*|\\*) (?:\\d{1,2}(?:,\\d{1,2})*|\\*)$`);

        // ^(\d{4}|\\*|\d{4}(,\d{4})*) ([1-9]|1[0-2]|\\*|([1-9]|1[0-2])(,([1-9]|1[0-2]))*) ([1-9]|1[0-9]|2[0-9]|3[01]|\\*|([1-9]|1[0-9]|2[0-9]|3[01])(,([1-9]|1[0-9]|2[0-9]|3[01]))*) ([0-9]|1[0-9]|2[0-3]|\\*|([0-9]|1[0-9]|2[0-3])(,([0-9]|1[0-9]|2[0-3]))*) ([0-5]?[0-9]|\\*|([0-5]?[0-9])(,([0-5]?[0-9]))*) ([0-5]?[0-9]|\\*|([0-5]?[0-9])(,([0-5]?[0-9]))*)$

        // Version 2
        /** 
         * ^
         * Year (\d{4}|\\*|\d{4}(,\d{4})*) 
         * Month ([1-9]|1[0-2]|\\*|([1-9]|1[0-2])(,([1-9]|1[0-2]))*) 
         * Day ([1-9]|1[0-9]|2[0-9]|3[01]|\\*|([1-9]|1[0-9]|2[0-9]|3[01])(,([1-9]|1[0-9]|2[0-9]|3[01]))*) 
         * Hour ([0-9]|1[0-9]|2[0-3]|\\*|([0-9]|1[0-9]|2[0-3])(,([0-9]|1[0-9]|2[0-3]))*) 
         * Minute ([0-5]?[0-9]|\\*|([0-5]?[0-9])(,([0-5]?[0-9]))*)
         * $
        */

        // Version 1
        // return new RegExp(`^(\d{4}|\\*) ([1-9]|1[0-2]|\\*) ([1-9]|1[0-9]|2[0-9]|3[01]|\\*) ([0-9]|1[0-9]|2[0-3]|\\*) ([0-5]?[0-9]|\\*)$`);
    };

    buildYearSchemaQueryRegex(year: string): string {
        const usedValue = year.split(',').join('|')
        return `(?:\\*(?: .*)?|(?:.*,)?(${usedValue})(?:,.*)?)`;
    }

    buildMonthSchemaQueryRegex(month: string): string {
        const usedValue = month.split(',').join('|')
        return `(?:\\*(?: .*)?|(?:.*,)?(${usedValue})(?:,.*)?)`;
    }
}