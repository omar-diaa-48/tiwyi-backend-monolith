import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Task } from '@prisma/client';
import { CustomAuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/guards/get-user.guard';
import { IJwtPayload } from 'src/interfaces';
import { WorkmatiqMsService } from './workmatiq-ms.service';

@Controller('workmatiq')
export class WorkmatiqMsController {
  constructor(private readonly service: WorkmatiqMsService) { }

  @Get('projects')
  @UseGuards(CustomAuthGuard)
  listenToReadUserProjectsTopic(
    @GetUser() user: IJwtPayload
  ) {
    return this.service.listenToReadUserProjectsTopic(user);
  }

  @Post('projects/:id/tags')
  @UseGuards(CustomAuthGuard)
  listenToCreateUserProjectTagTopic(
    @GetUser() user: IJwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any
  ) {
    return this.service.listenToCreateUserProjectTagTopic(user, id, dto);
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

  @Patch('worksheets/:id')
  @UseGuards(CustomAuthGuard)
  listenToPatchUserWorksheetTopic(
    @GetUser() user: IJwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any
  ) {
    return this.service.listenToPatchUserWorksheetTopic(user, id, dto);
  }

  @Post('tasks')
  @UseGuards(CustomAuthGuard)
  listenToCreateUserWorksheetTaskTopic(
    @GetUser() user: IJwtPayload,
    @Body() dto: any,
  ) {
    return this.service.listenToCreateUserWorksheetTaskTopic(user, dto);
  }

  @Get('tasks/:id')
  @UseGuards(CustomAuthGuard)
  listenToReadUserWorksheetTaskTopic(
    @GetUser() user: IJwtPayload,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.service.listenToReadUserWorksheetTaskTopic(user, id);
  }

  @Patch('tasks/:id')
  @UseGuards(CustomAuthGuard)
  listenToPatchUserWorksheetTaskTopic(
    @GetUser() user: IJwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
  ) {
    return this.service.listenToPatchUserWorksheetTaskTopic(user, id, dto);
  }

  @Patch('tasks/:id/attachments')
  @UseGuards(CustomAuthGuard)
  @UseInterceptors(FilesInterceptor('attachments'))
  listenToPatchUserWorksheetTaskAttachmentsTopic(
    @GetUser() user: IJwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() attachments: Array<Express.Multer.File>
  ): Promise<Task> {
    return this.service.listenToPatchUserWorksheetTaskAttachmentsTopic(user, id, attachments);
  }

  @Patch('tasks/:id/comments')
  @UseGuards(CustomAuthGuard)
  listenToPatchUserWorksheetTaskCommentsTopic(
    @GetUser() user: IJwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any
  ) {
    return this.service.listenToPatchUserWorksheetTaskCommentsTopic(user, id, dto);
  }

  @Delete('tasks/:id')
  @UseGuards(CustomAuthGuard)
  listenToDeleteUserWorksheetTaskTopic(
    @GetUser() user: IJwtPayload,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.service.listenToDeleteUserWorksheetTaskTopic(user, id);
  }

  @Patch('calendar-events')
  @UseGuards(CustomAuthGuard)
  listenToReadCalendarEventsTopic(
    @GetUser() user: IJwtPayload,
    @Body() dto: any
  ) {
    return this.service.listenToReadCalendarEventsTopic(user, dto);
  }

  @Post('calendar-events')
  @UseGuards(CustomAuthGuard)
  listenToCreateCalendarEventTopic(
    @GetUser() user: IJwtPayload,
    @Body() dto: any
  ) {
    return this.service.listenToCreateCalendarEventTopic(user, dto);
  }
}
