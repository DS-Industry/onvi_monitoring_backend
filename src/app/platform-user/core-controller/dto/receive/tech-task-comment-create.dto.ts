import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class TechTaskCommentCreateDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  techTaskId: number;
}
