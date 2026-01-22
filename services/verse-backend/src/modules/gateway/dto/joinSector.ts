import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class JoinSectorDto {
    @IsNotEmpty()
    @IsString()
    @Length(4, 12)
    @Transform(({ value }) => value?.trim().toUpperCase())
    accessKey: string;
}