import { Injectable } from "@nestjs/common";
import { UserEntity } from "@prisma/client";
import { IJwtPayload } from "src/interfaces";

@Injectable()
export class BaseService {
    formatJwtPayloadFromUserEntity(userEntity: UserEntity): IJwtPayload {
        return {
            email: userEntity.email,
            userEntityId: userEntity.id,
            userId: userEntity.userId,
            token: '',
        }
    }
}
