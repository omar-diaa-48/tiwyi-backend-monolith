import { Controller } from '@nestjs/common';
import { WorkmatiqMsService } from './workmatiq-ms.service';

@Controller()
export class WorkmatiqMsController {
  constructor(private readonly service: WorkmatiqMsService) { }
}
