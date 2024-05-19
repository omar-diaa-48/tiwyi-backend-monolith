import { Controller, Get, UseGuards } from '@nestjs/common';
import { CustomAuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/guards/get-user.guard';
import { IJwtPayload } from 'src/interfaces';
import { HrMsService } from './hr-ms.service';

@Controller('hr')
export class HrMsController {
  constructor(private readonly service: HrMsService) { }

  @Get('corporates')
  @UseGuards(CustomAuthGuard)
  listenToReadUserCorporatesTopic(
    @GetUser() user: IJwtPayload
  ) {
    return this.service.listenToReadUserCorporatesTopic(user);
  }
}
