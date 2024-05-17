import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IJwtPayload } from 'src/interfaces';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): IJwtPayload => {
        const request: Request = ctx.switchToHttp().getRequest();
        return request["user"];
    },
);