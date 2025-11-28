import { CurrencyType, CurrencyView } from '@prisma/client';

export class DeviceOperationFullDataResponseDto {
  id?: number;
  carWashDeviceId: number;
  operDate: Date;
  loadDate: Date;
  counter: string;
  operSum: number;
  confirm: number;
  isAgregate: number;
  localId: number;
  currencyId: number;
  isBoxOffice: number;
  errNumId?: number;
  currencyType?: CurrencyType;
  currencyName?: string;
  currencyView?: CurrencyView;
  posId?: number;
  posName?: string;
}
