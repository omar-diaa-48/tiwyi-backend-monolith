import { Module } from '@nestjs/common';

import { WorkmatiqMsController } from './workmatiq-ms.controller';
import { WorkmatiqMsService } from './workmatiq-ms.service';

@Module({
  imports: [],
  controllers: [WorkmatiqMsController],
  providers: [WorkmatiqMsService]
})
export class WorkmatiqMsModule { }
