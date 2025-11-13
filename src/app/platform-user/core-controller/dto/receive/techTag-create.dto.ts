import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TechTagCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsString()
  @IsOptional()
  code?: string;
}
