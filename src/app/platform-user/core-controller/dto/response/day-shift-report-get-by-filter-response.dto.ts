import { StatusWorkDayShiftReport, TypeEstimation, TypeWorkDay } from "@prisma/client";

export class DayShiftReportGetByFilterResponseDto {
  id: number;
  workerId: number;
  workDate: Date;
  typeWorkDay: TypeWorkDay;
  timeWorkedOut?: string;
  startWorkingTime?: Date;
  endWorkingTime?: Date;
  estimation?: TypeEstimation;
  status?: StatusWorkDayShiftReport;
  cashAtStart?: number;
  cashAtEnd?: number;
  prize?: number;
  fine?: number;
  comment?: string;
}