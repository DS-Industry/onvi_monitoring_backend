import { CurrencyType } from '@prisma/client';

export class DeviceOperationGetAllByCutTypeAndDateDto {
  carWashPosId: number;
  dateStart: Date;
  dateEnd: Date;
}
