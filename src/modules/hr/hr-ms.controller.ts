import { Controller } from '@nestjs/common';
import { HrMsService } from './hr-ms.service';

@Controller()
export class HrMsController {
  constructor(private readonly service: HrMsService) { }
}
