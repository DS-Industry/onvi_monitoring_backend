import { StatusCashCollection } from '@prisma/client';

export interface CashCollectionResponseDto {
  id: number;
  cashCollectionDate: Date;
  oldCashCollectionDate: Date;
  status: StatusCashCollection;
  sumFact: number;
  virtualSum: number;
  sumCard: number;
  shortage: number;
  countCar: number;
  countCarCard: number;
  averageCheck: number;
  cashCollectionDeviceType: CashCollectionDeviceTypeDto[];
  cashCollectionDevice: CashCollectionDeviceDto[];
}

export interface CashCollectionDeviceTypeDto {
  id: number;
  typeName: string;
  sumCoinDeviceType: number;
  sumPaperDeviceType: number;
  sumFactDeviceType: number;
  shortageDeviceType: number;
  virtualSumDeviceType: number;
}

export interface CashCollectionDeviceDto {
  id: number;
  deviceId: number;
  deviceName: string;
  deviceType: string;
  oldTookMoneyTime: Date;
  tookMoneyTime: Date;
  sumDevice: number;
  sumCoinDevice: number;
  sumPaperDevice: number;
  virtualSumDevice: number;
}
