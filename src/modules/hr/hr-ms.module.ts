import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { WorkmatiqMsModule } from '../workmatiq/workmatiq-ms.module';
import { HrMsController } from './hr-ms.controller';
import { HrMsService } from './hr-ms.service';

@Module({
  imports: [DatabaseModule, JwtModule, WorkmatiqMsModule],
  controllers: [HrMsController],
  providers: [HrMsService],
  exports: [HrMsService]
})
export class HrMsModule { }
