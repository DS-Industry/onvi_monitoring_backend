import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class TechTaskCompletionShapeDto {
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return JSON.parse(value);
    return [];
  })
  valueData: itemValueDto[];
}

export class itemValueDto {
  @IsNumber()
  @IsNotEmpty({ message: 'itemValueId is required' })
  itemValueId: number;
  @IsString()
  @IsNotEmpty({ message: 'value is required' })
  value: string;
}
