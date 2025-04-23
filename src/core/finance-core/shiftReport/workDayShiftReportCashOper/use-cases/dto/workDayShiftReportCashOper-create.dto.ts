import { TypeWorkDayShiftReportCashOper } from '@prisma/client';

export class WorkDayShiftReportCashOperCreateDto {
  type: TypeWorkDayShiftReportCashOper;
  sum: number;
  carWashDeviceId?: number;
  eventData?: Date;
  comment?: string;
}
