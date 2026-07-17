import { IsIn } from 'class-validator';

export class ReactDto {
    @IsIn(['respect', 'hype', 'rivalry', 'brutal'])
    type: string;
}