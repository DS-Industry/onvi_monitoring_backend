import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CorporateBonusOperCreateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Operation type ID is required' })
  typeOperId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Amount is required' })
  sum: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Car wash device ID is required' })
  carWashDeviceId: number;
}
