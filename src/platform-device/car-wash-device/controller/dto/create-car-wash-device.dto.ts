import { IsString, IsNumber } from 'class-validator';
export class CreateCarWashDeviceDto {
  @IsString()
  name: string;

  @IsString()
  carWashDeviceMetaData: string;

  @IsString()
  status: string;

  @IsString()
  ipAddress: string;

  @IsNumber()
  carWashDeviceTypeId: number;

  @IsNumber()
  deviceRoleId?: number;
}
