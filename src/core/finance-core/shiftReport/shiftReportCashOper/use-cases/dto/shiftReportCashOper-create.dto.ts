import { TypeWorkDayShiftReportCashOper } from '@prisma/client';

export class ShiftReportCashOperCreateDto {
  type: TypeWorkDayShiftReportCashOper;
  sum: number;
  carWashDeviceId?: number;
  eventData?: Date;
  comment?: string;
}
