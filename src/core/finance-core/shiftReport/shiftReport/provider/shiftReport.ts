import { Provider } from "@nestjs/common";
import { IShiftReportRepository } from "@finance/shiftReport/shiftReport/interface/shiftReport";
import { ShiftReportRepository } from "@finance/shiftReport/shiftReport/repository/shiftReport";

export const ShiftReportRepositoryProvider: Provider = {
  provide: IShiftReportRepository,
  useClass: ShiftReportRepository,
}