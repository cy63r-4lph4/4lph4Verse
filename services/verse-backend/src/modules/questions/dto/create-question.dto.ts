import { ArrayMinSize, IsArray, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateQuestionDto {
    @IsString()
    courseId: string;

    @IsString()
    prompt: string;

    @IsArray()
    @ArrayMinSize(2)
    @IsString({ each: true })
    options: string[];

    @IsInt()
    @Min(0)
    correctIndex: number;

    @IsOptional()
    @IsIn(['easy', 'medium', 'hard'])
    difficulty?: 'easy' | 'medium' | 'hard';

    @IsOptional()
    @IsString()
    category?: string;
}