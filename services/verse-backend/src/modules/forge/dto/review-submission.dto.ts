import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ReviewSubmissionDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}