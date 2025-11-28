import {
  StatusWorkDayShiftReport,
  TypeEstimation,
  TypeWorkDay,
} from '@prisma/client';

export class ShiftReportUpdateDto {
  typeWorkDay?: TypeWorkDay;
  timeWorkedOut?: string;
  startWorkingTime?: Date;
  endWorkingTime?: Date;
  estimation?: TypeEstimation;
  status?: StatusWorkDayShiftReport;
  cashAtStart?: number;
  cashAtEnd?: number;
  dailyShiftPayout?: number;
  comment?: string;
  gradingData?: gradingDataDto[];
}

export class gradingDataDto {
  parameterId: number;
  estimationId: number;
}
