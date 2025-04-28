export class CarWashDeviceCreateDto {
  name: string;
  carWashDeviceMetaData: string;
  status: string;
  ipAddress: string;
  carWashDeviceTypeId: number;
  carWashPosId: number;
  deviceRoleId?: number;
}
