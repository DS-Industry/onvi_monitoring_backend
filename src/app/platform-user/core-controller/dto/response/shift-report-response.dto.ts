import { TypeEstimation, TypeWorkDay } from "@prisma/client";

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
  workDays: WorkDayShiftReportDto[];
}

export class WorkDayShiftReportDto {
  workDayId: number;
  workDate: Date;
  typeWorkDay: TypeWorkDay;
  timeWorkedOut?: string;
  estimation?: TypeEstimation;
  prize?: number;
  fine?: number;
}
