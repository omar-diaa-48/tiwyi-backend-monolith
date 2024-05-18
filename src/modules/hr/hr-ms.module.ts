import { Module } from '@nestjs/common';
import { WorkmatiqMsModule } from '../workmatiq/workmatiq-ms.module';
import { HrMsController } from './hr-ms.controller';
import { HrMsService } from './hr-ms.service';

@Module({
  imports: [WorkmatiqMsModule],
  controllers: [HrMsController],
  providers: [HrMsService]
})
export class HrMsModule { }
