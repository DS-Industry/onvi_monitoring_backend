export class FalseOperationResponseDto {
  falseData: FalseDataDto[];
  totalCount: number;
}

export class FalseDataDto {
  deviceId: number;
  deviceName: string;
  operDay: Date;
  falseOperCount: number;
}
