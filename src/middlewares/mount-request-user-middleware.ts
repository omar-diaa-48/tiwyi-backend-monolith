import { IJwtPayload } from '@libs/shared/interfaces';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class MountRequestUserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const bearerToken = req.headers.authorization;

        let payload: IJwtPayload | null = null;

        if (!bearerToken) {
            return next();
        }

        const [_, token] = bearerToken.split(' ')

        if (!token) {
            return next();
        }

        payload = jwt.verify(token, process.env.BE_JWT_SECRET) as IJwtPayload

        req["user"] = payload;

        next();
    }
}
