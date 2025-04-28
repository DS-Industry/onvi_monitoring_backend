export class DeviceOperationMonitoringResponseDto {
  oper: MonitoringDto[];
  totalCount: number;
}
export class MonitoringDto {
  id: number;
  sumOper: number;
  dateOper: Date;
  dateLoad: Date;
  counter: string;
  localId: number;
  currencyType: string;
}
