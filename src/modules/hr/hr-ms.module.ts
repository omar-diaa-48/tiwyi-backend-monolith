import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { WorkmatiqMsModule } from '../workmatiq/workmatiq-ms.module';
import { HrMsController } from './hr-ms.controller';
import { HrMsService } from './hr-ms.service';

@Module({
  imports: [DatabaseModule, WorkmatiqMsModule],
  controllers: [HrMsController],
  providers: [HrMsService],
  exports: [HrMsService]
})
export class HrMsModule { }
