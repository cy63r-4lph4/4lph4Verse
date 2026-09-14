import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class ReviewSubmissionDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  explanation?: string;

  @IsOptional()
  @IsUUID()
  resourceId?: string;
}
