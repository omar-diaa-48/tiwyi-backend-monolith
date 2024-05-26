import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CustomAuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/guards/get-user.guard';
import { IJwtPayload } from 'src/interfaces';
import { WorkmatiqMsService } from './workmatiq-ms.service';

@Controller('workmatiq')
export class WorkmatiqMsController {
  constructor(private readonly service: WorkmatiqMsService) { }

  @Get('projects')
  @UseGuards(CustomAuthGuard)
  listenToReadUserCorporatesTopic(
    @GetUser() user: IJwtPayload
  ) {
    return this.service.listenToReadUserProjectsTopic(user);
  }

  @Get('workspaces')
  @UseGuards(CustomAuthGuard)
  listenToReadUserWorkspacesTopic(
    @GetUser() user: IJwtPayload
  ) {
    return this.service.listenToReadUserWorkspacesTopic(user);
  }

  @Post('workspaces')
  @UseGuards(CustomAuthGuard)
  listenToCreateUserWorkspaceTopic(
    @GetUser() user: IJwtPayload,
    @Body() dto: any
  ) {
    return this.service.listenToCreateUserWorkspaceTopic(user, dto);
  }

  @Delete('workspaces/:id')
  @UseGuards(CustomAuthGuard)
  listenToDeleteUserWorkspaceTopic(
    @GetUser() user: IJwtPayload,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.service.listenToDeleteUserWorkspaceTopic(user, id);
  }

  @Post('worksheets')
  @UseGuards(CustomAuthGuard)
  listenToCreateUserWorksheetTopic(
    @GetUser() user: IJwtPayload,
    @Body() dto: any
  ) {
    return this.service.listenToCreateUserWorksheetTopic(user, dto);
  }
}
