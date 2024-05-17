import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ICreateUserPayload } from "src/interfaces/payload.interface";

export class CreateUserDto implements ICreateUserPayload {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}

export class ISignUpDto extends CreateUserDto { }
export class ISignInDto extends CreateUserDto { }