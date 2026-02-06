import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    identity: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}