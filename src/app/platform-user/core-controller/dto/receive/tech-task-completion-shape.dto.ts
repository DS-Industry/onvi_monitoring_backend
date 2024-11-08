import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TechTaskCompletionShapeDto {
  @IsArray()
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
