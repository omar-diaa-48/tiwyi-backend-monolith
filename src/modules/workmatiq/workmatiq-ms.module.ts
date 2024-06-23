import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { CalendarModule } from '../calendar/calendar.module';
import { ChangeLogModule } from '../change-log/change-log.module';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { ProjectPreferenceService } from './services/project-preference.service';
import { WorkmatiqMsController } from './workmatiq-ms.controller';
import { WorkmatiqMsService } from './workmatiq-ms.service';

@Module({
  imports: [DatabaseModule, JwtModule, StorageModule, ChangeLogModule, CalendarModule],
  controllers: [WorkmatiqMsController],
  providers: [WorkmatiqMsService, ProjectPreferenceService],
  exports: [WorkmatiqMsService],
})
export class WorkmatiqMsModule { }
