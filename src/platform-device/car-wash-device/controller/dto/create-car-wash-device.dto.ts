import { IsString, IsNumber, IsOptional } from 'class-validator';
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
  @IsOptional()
  carWashDeviceTypeId: number;

  @IsNumber()
  @IsOptional()
  deviceRoleId?: number;
}
