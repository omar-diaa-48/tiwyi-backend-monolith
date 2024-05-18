import { Module } from '@nestjs/common';
import { HrMsController } from './hr-ms.controller';
import { HrMsService } from './hr-ms.service';

@Module({
  imports: [],
  controllers: [HrMsController],
  providers: [HrMsService]
})
export class HrMsModule { }
