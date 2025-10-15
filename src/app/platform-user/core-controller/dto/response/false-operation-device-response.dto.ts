export class FalseOperationDeviceResponseDto {
  oper: FalseOperationDeviceDto[];
  totalCount: number;
}

export class FalseOperationDeviceDto {
  id: number;
  carWashDeviceId: number;
  deviceName: string;
  sumOper: number;
  dateOper: Date;
  dateLoad: Date;
  counter: string;
  localId: number;
  currencyType: string;
  falseCheck: boolean;
}