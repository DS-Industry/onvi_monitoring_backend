import { CurrencyType } from '@prisma/client';

export class DeviceOperationGetAllByCutTypeAndDateDto {
  currencyType: CurrencyType;
  carWashDeviceId: number;
  dateStart: Date;
  dateEnd: Date;
}
