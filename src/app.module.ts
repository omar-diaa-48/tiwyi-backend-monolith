import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configurations from './config/configurations';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import modules from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configurations] }),

    ...modules
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      .forRoutes('*')
  }
}
