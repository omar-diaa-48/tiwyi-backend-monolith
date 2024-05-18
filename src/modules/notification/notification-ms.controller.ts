import { Controller } from '@nestjs/common';
import { NotificationMsService } from './notification-ms.service';

@Controller()
export class NotificationMsController {
  constructor(private readonly service: NotificationMsService) { }
}
