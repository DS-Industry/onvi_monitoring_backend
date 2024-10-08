export interface CarWashDeviceFullDataResponseDto {
  id: number;
  name: string;
  carWashDeviceMetaData: string;
  status: string;
  ipAddress: string;
  carWashPosId: number;
  deviceRoleId: number;
  deviceType: {
    name: string;
    code: string;
  }
}