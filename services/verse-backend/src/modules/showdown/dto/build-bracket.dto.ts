import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class BuildBracketDto {
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  arenaUserIds: string[];
}