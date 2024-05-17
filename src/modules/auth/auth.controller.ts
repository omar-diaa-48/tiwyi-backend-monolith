import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from "@prisma/client";
import { Request, Response } from 'express';
import { CreateUserDto, ISignInDto, ISignUpDto } from 'src/dtos';
import { AuthGuard as CustomAuthGuard } from 'src/guards/auth.guard';
import { IJwtPayload } from "src/interfaces";
import { GetUser } from '../../guards/get-user.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  @Post('create')
  createUser(
    @Body() dto: CreateUserDto
  ): Promise<UserEntity> {
    return this.authService.signUp(dto);
  }

  @Post('sign-up')
  signUp(
    @Body() dto: ISignUpDto
  ): Promise<UserEntity> {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  signIn(
    @Body() dto: ISignInDto
  ): Promise<Omit<UserEntity, "password">> {
    return this.authService.signIn(dto);
  }

  @Post('confirm-password')
  @UseGuards(CustomAuthGuard)
  confirmPassword(
    @GetUser() user: IJwtPayload,
    @Body() dto: Pick<ISignUpDto, "password">
  ): Promise<UserEntity> {
    return this.authService.confirmPassword(user, dto);
  }

  @Get('verify-token')
  @UseGuards(CustomAuthGuard)
  verifyToken(
    @GetUser() user: IJwtPayload
  ): Promise<{ entity: IJwtPayload | null, next?: string | undefined }> {
    return this.authService.verifyToken(user);
  }

  /**
   * {@link https://dev.to/imichaelowolabi/how-to-implement-login-with-google-in-nest-js-2aoa}
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) { }

  /**
   * {@link https://dev.to/imichaelowolabi/how-to-implement-login-with-google-in-nest-js-2aoa}
   */
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const jwtPayload = await this.authService.googleSignIn(req)

    if (jwtPayload) {
      res.redirect(`${this.configService.get<string>('FE_BASE_URL')}/auth/google/redirect?token=${jwtPayload.token}`)
    }
    else {
      res.redirect('/')
    }
  }

  @Get('users')
  getUsers(): Promise<UserEntity[]> {
    return this.authService.getUsers();
  }
}
