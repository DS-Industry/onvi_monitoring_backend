import { TypeEstimation, TypeWorkDay } from "@prisma/client";

export class WorkDayShiftReportUpdateDto {
  typeWorkDay?: TypeWorkDay;
  timeWorkedOut?: string;
  startWorkingTime?: Date;
  endWorkingTime?: Date;
  estimation?: TypeEstimation;
  prize?: number;
  fine?: number;
  comment?: string;
}