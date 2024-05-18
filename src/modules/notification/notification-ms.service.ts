import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICreateUserTopic } from 'src/interfaces/kafka-topics/auth';
import { PayloadType } from 'src/interfaces/topic.interface';

@Injectable()
export class NotificationMsService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService
  ) { }

  async listenToUserCreatedTopic(user: ICreateUserTopic[PayloadType]) {
    const confirmation_url = `${this.configService.get<string>('FE_BASE_URL')}`;

    console.log({ confirmation_url });

    // await this.mailerService.sendMail({
    //   to: user.email,
    //   from: '"Support Team" <support@tiwyw.com>',
    //   subject: 'Welcome to TIWYW! Confirm your Email',
    //   template: './welcome',
    //   context: {
    //     name: user.email,
    //     confirmation_url,
    //   },
    // });
  }
}
