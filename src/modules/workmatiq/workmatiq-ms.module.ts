import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { ProjectPreferenceService } from './services/project-preference.service';
import { WorkmatiqMsController } from './workmatiq-ms.controller';
import { WorkmatiqMsService } from './workmatiq-ms.service';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [WorkmatiqMsController],
  providers: [WorkmatiqMsService, ProjectPreferenceService],
  exports: [WorkmatiqMsService],
})
export class WorkmatiqMsModule { }