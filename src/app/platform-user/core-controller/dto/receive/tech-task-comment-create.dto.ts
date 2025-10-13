import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class TechTaskCommentCreateDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
