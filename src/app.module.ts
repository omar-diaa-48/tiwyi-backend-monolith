import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configurations from './config/configurations';
import modules from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configurations] }),

    ...modules
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
