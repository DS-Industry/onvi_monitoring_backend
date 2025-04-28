import { Provider } from '@nestjs/common';
import { IMonthlyPlanPosRepository } from '@pos/monthlyPlanPos/interface/monthlyPlanPos';
import { MonthlyPlanPosRepository } from '@pos/monthlyPlanPos/repository/monthlyPlanPos';

export const MonthlyPlanPosProvider: Provider = {
  provide: IMonthlyPlanPosRepository,
  useClass: MonthlyPlanPosRepository,
};
