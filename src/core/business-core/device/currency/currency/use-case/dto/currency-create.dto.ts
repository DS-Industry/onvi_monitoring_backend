import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CurrencyCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'code is required' })
  code: string;
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsNumber()
  @IsNotEmpty({ message: 'curType is required' })
  curType: number;
  @IsNumber()
  @IsOptional()
  curView: number;
}
