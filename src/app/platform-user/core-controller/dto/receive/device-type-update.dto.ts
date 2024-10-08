import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DeviceTypeUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id is required' })
  id: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  code?: string;
}
