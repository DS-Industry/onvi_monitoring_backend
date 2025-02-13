import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { CashCollectionRepositoryProvider } from '@finance/cashCollection/cashCollection/provider/cashCollection';
import { CashCollectionDeviceRepositoryProvider } from '@finance/cashCollection/cashCollectionDevice/provider/cashCollectionDevice';
import { CashCollectionDeviceTypeRepositoryProvider } from '@finance/cashCollection/cashCollectionDeviceType/provider/cashCollectionDeviceType';
import { CreateCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-create';
import { CreateManyCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-create-many';
import { FindMethodsCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-find-methods';
import { CreateManyCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-create-many';
import { FindMethodsCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-find-methods';
import { UpdateCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-update';
import { FindMethodsCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-find-methods';
import { RecalculateCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-recalculate';
import { UpdateCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-update';
import { UpdateManyCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-update-many';
import { UpdateCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-update';
import { UpdateManyCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-update-many';
import { GetAllByFilterCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-get-all-by-filter';
import { GetOneFullDataCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-get-one-full-data';
import { CalculateMethodsCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-calculate-methods';
import { ShiftReportRepositoryProvider } from '@finance/shiftReport/shiftReport/provider/shiftReport';
import { WorkDayShiftReportRepositoryProvider } from '@finance/shiftReport/workDayShiftReport/provider/workDayShiftReport';
import { CreateShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-create';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import { AddWorkerShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-add-worker';
import { GetAllByFilterShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-get-all-by-filter';
import { FindMethodsWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-find-methods';
import { GetByFilterWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-get-by-filter';
import { GetOneFullShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-get-one-full';
import { UpdateWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-update';
import { UpdateShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-update';

const repositories: Provider[] = [
  CashCollectionRepositoryProvider,
  CashCollectionDeviceRepositoryProvider,
  CashCollectionDeviceTypeRepositoryProvider,
  ShiftReportRepositoryProvider,
  WorkDayShiftReportRepositoryProvider,
];

const cashCollectionUseCase: Provider[] = [
  CreateCashCollectionUseCase,
  UpdateCashCollectionUseCase,
  FindMethodsCashCollectionUseCase,
  RecalculateCashCollectionUseCase,
  GetAllByFilterCashCollectionUseCase,
  GetOneFullDataCashCollectionUseCase,
  CalculateMethodsCashCollectionUseCase,
];

const cashCollectionDeviceUseCase: Provider[] = [
  CreateManyCashCollectionDeviceUseCase,
  FindMethodsCashCollectionDeviceUseCase,
  UpdateCashCollectionDeviceUseCase,
  UpdateManyCashCollectionDeviceUseCase,
];

const cashCollectionDeviceTypeUseCase: Provider[] = [
  CreateManyCashCollectionTypeUseCase,
  FindMethodsCashCollectionTypeUseCase,
  UpdateCashCollectionTypeUseCase,
  UpdateManyCashCollectionTypeUseCase,
];

const shiftReportUseCase: Provider[] = [
  CreateShiftReportUseCase,
  FindMethodsShiftReportUseCase,
  AddWorkerShiftReportUseCase,
  GetAllByFilterShiftReportUseCase,
  GetOneFullShiftReportUseCase,
  UpdateShiftReportUseCase,
];

const workDayShiftReportUseCase: Provider[] = [
  FindMethodsWorkDayShiftReportUseCase,
  GetByFilterWorkDayShiftReportUseCase,
  UpdateWorkDayShiftReportUseCase,
];

@Module({
  imports: [PrismaModule, BusinessCoreModule],
  providers: [
    ...repositories,
    ...cashCollectionUseCase,
    ...cashCollectionDeviceUseCase,
    ...cashCollectionDeviceTypeUseCase,
    ...shiftReportUseCase,
    ...workDayShiftReportUseCase,
  ],
  exports: [
    ...cashCollectionUseCase,
    ...cashCollectionDeviceUseCase,
    ...cashCollectionDeviceTypeUseCase,
    ...shiftReportUseCase,
    ...workDayShiftReportUseCase,
  ],
})
export class FinanceCoreModule {}
