export class ShiftReportResponseDto {
  id: number;
  posId: number;
  startDate: Date;
  endDate: Date;
  workers: WorkerShiftReportDto[];
}

export class WorkerShiftReportDto {
  workerId: number;
  name: string;
  surname: string;
  middlename: string;
  position: string;
}