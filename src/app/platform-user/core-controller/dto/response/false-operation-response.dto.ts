export class FalseOperationResponseDto {
  oper: FalseOperationDto[];
  totalCount: number;
}

export class FalseOperationDto {
  id: number;
  posName: string;
  deviceName: string;
  sumOper: number;
  dateOper: Date;
  dateLoad: Date;
  counter: string;
  localId: number;
  currencyType: string;
}
