import { IJwtPayload } from '@libs/shared/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): IJwtPayload => {
        const request: Request = ctx.switchToHttp().getRequest();
        return request["user"];
    },
);