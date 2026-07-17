import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  courseId: string;

  @IsIn(['thought', 'question', 'announcement'])
  type: 'thought' | 'question' | 'announcement';

  @IsString()
  @MaxLength(2000)
  content: string;

  @IsOptional()
  pinned?: boolean; // only honored for type === 'announcement', by instructors/admins
}