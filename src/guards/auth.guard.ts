import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IJwtPayload } from 'src/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return false;
        }

        const [_, token] = authHeader.split(' ')

        if (!token) {
            return false;
        }

        try {
            const decodedPayload: IJwtPayload = this.jwtService.verify(token, { secret: this.configService.get<string>('BE_JWT_SECRET') });
            request['user'] = decodedPayload;
            return true;
        } catch (error) {
            return false;
        }
    }
}
