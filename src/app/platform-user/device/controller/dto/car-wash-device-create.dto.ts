import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CarWashDeviceCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'carWashDeviceMetaData is required' })
  carWashDeviceMetaData: string;
  @IsString()
  @IsNotEmpty({ message: 'status is required' })
  status: string;
  @IsString()
  @IsNotEmpty({ message: 'ipAddress is required' })
  ipAddress: string;
  @IsNumber()
  @IsNotEmpty({ message: 'carWashDeviceTypeId is required' })
  carWashDeviceTypeId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'carWashPosId is required' })
  carWashPosId: number;
}
