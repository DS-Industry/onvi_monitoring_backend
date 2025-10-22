export class CashCollectionRecalculateDto {
  cashCollectionDeviceData: CashCollectionDeviceDataDto[];
  cashCollectionDeviceTypeData: CashCollectionDeviceTypeDataDto[];
}

export class CashCollectionDeviceDataDto {
  cashCollectionDeviceId: number;
  oldTookMoneyTime?: Date;
  tookMoneyTime: Date;
}

export class CashCollectionDeviceTypeDataDto {
  cashCollectionDeviceTypeId: number;
  sumCoin?: number;
  sumPaper?: number;
}
