import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class NotificationTagUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'tagId is required' })
  tagId: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  color?: string;
}
