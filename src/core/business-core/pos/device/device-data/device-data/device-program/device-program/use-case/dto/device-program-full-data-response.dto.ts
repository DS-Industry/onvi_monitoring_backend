import { Prisma } from '@prisma/client';

export class DeviceProgramFullDataResponseDto {
  id?: number;
  carWashDeviceId?: number;
  carWashDeviceProgramsTypeId?: number;
  beginDate: Date;
  loadDate: Date;
  endDate: Date;
  confirm: number;
  isPaid: number;
  localId: number;
  isAgregate?: number;
  minute?: Prisma.Decimal;
  errNumId?: number;
  programName?: string;
  posId?: number;
}
