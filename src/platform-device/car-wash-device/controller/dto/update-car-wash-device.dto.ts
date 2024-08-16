import { IsOptional, IsString } from 'class-validator';
export class UpdateCarWashDeviceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  carWashDeviceMetaData?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  carWashDeviceTypeId: number;
  deviceRoleId?: number;
}
