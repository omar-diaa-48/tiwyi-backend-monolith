import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BaseModule } from '../base/base.modules';
import { DatabaseModule } from '../database/database.module';
import { HrMsModule } from '../hr/hr-ms.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [DatabaseModule, JwtModule, HrMsModule, BaseModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [AuthService]
})
export class AuthModule { }
