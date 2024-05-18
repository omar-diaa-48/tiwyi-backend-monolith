import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { WorkmatiqMsController } from './workmatiq-ms.controller';
import { WorkmatiqMsService } from './workmatiq-ms.service';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkmatiqMsController],
  providers: [WorkmatiqMsService],
  exports: [WorkmatiqMsService],
})
export class WorkmatiqMsModule { }
