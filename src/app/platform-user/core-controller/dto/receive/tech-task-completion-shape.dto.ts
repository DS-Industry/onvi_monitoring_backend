import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class TechTaskCompletionShapeDto {
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return JSON.parse(value);
    return [];
  })
  valueData: itemValueDto[];
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  sendWorkDate?: Date;
}

export class itemValueDto {
  @IsNumber()
  @IsNotEmpty({ message: 'itemValueId is required' })
  itemValueId: number;
  @IsString()
  @IsNotEmpty({ message: 'value is required' })
  value: string;
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
