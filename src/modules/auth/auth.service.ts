import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { ISignInDto, ISignUpDto } from 'src/dtos';
import { IJwtPayload } from 'src/interfaces';
import { IUser } from 'src/interfaces/base.interface';
import { BaseService } from '../base/base.service';
import { DatabaseService } from '../database/database.service';
import { HrMsService } from '../hr/hr-ms.service';

@Injectable()
export class AuthService {
  private SALT_ROUNDS = 10

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private database: DatabaseService,

    private readonly baseService: BaseService,
    private readonly hrMsService: HrMsService,
  ) { }

  async signUp(dto: ISignUpDto): Promise<UserEntity> {
    let entity = await this.database.userEntity.findUnique({ where: { email: dto.email } })

    if (!entity) {
      const user = await this.database.user.create({});

      const encryptedPassword = await this.encryptPassword(dto.password)

      entity = await this.database.userEntity.create({
        data: {
          email: dto.email,
          password: encryptedPassword,
          name: dto.email,
          userId: user.id
        }
      })

    }

    await this.hrMsService.listenToUserCreatedTopic(this.baseService.formatJwtPayloadFromUserEntity(entity))

    return entity;
  }

  async signIn(dto: ISignInDto): Promise<Omit<UserEntity, "password">> {
    const entity = await this.database.userEntity.findUnique({ where: { email: dto.email } })

    if (!entity) {
      throw new BadRequestException('User not found')
    }

    const hasValidCredentials = await this.verifyPassword(dto.password, entity.password)

    if (!hasValidCredentials) {
      throw new BadRequestException('Invalid credentials')
    }

    const { password, ...restOfEntity } = entity;

    return restOfEntity;
  }

  async confirmPassword(user: IJwtPayload, dto: Pick<ISignUpDto, "password">): Promise<UserEntity> {
    const encryptedPassword = await this.encryptPassword(dto.password)
    const entity = await this.database.userEntity.update({ data: { password: encryptedPassword }, where: { email: user.email } })
    return entity;
  }

  async verifyToken(user: IJwtPayload): Promise<{ entity: IJwtPayload | null, next?: string | undefined }> {
    const entity = await this.database.userEntity.findUnique({ where: { email: user.email } })

    if (!entity) {
      return {
        entity: null,
        next: '/auth/sign-up'
      }
    }

    if (!entity.password) {
      return {
        entity: user,
        next: '/auth/confirm-password'
      }
    }

    return { entity: user }
  }

  async googleSignIn(req: Request): Promise<IJwtPayload | null> {
    if (!req['user']) {
      return null
    }

    const user: IUser = {
      email: req['user'].email,
      password: ''
    }

    const userEntity = await this.signUp(user)

    const jwtPayload = this.getJwtPayloadFromUser(userEntity);

    return jwtPayload
  }

  async getUsers(): Promise<UserEntity[]> {
    return await this.database.userEntity.findMany();
  }



  getJwtPayloadFromUser(user: UserEntity): IJwtPayload {
    const payload: Omit<IJwtPayload, "token"> = {
      email: user.email,
      userId: user.userId,
      userEntityId: user.id
    }

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('BE_JWT_SECRET'),
      expiresIn: '15d'
    });

    const jwtPayload: IJwtPayload = {
      ...payload,
      token
    }

    return jwtPayload;
  }

  async encryptPassword(password: string) {
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  async verifyPassword(plainPassword: string, encryptedPassword: string) {
    return bcrypt.compare(plainPassword, encryptedPassword)
  }
}
