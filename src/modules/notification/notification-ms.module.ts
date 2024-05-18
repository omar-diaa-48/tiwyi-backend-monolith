import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../database/database.module';
import { NotificationMsController } from './notification-ms.controller';
import { NotificationMsService } from './notification-ms.service';

@Module({
  imports: [
    DatabaseModule,
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('SMTP_USERNAME'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"TIWYW" <${config.get('SMTP_USERNAME')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationMsController],
  providers: [NotificationMsService],
  exports: [NotificationMsService],
})
export class NotificationMsModule { }
