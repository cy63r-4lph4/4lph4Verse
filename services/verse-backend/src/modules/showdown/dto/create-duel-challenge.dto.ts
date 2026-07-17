import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateDuelChallengeDto {
  @IsString()
  courseId: string;

  @IsString()
  opponentArenaUserId: string;

  @IsOptional() @IsInt() @Min(1) @Max(10)
  questionsPerMatch?: number;

  @IsOptional() @IsInt() @Min(5) @Max(120)
  timeLimitSeconds?: number;
}