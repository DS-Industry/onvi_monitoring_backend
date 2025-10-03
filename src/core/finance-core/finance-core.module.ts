import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { HrCoreModule } from '@hr/hr-core.module';
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
import { ShiftReportRepositoryProvider } from '@finance/shiftReport/shiftReport/provider/shiftReport';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import { ReceiverShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-receiver';
import { UpdateShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-update';
import { ShiftReportCashOperRepositoryProvider } from '@finance/shiftReport/shiftReportCashOper/provider/shiftReportCashOper';
import { CreateShiftReportCashOperUseCase } from '@finance/shiftReport/shiftReportCashOper/use-cases/shiftReportCashOper-create';
import { CalculateShiftReportCashOperUseCase } from '@finance/shiftReport/shiftReportCashOper/use-cases/shiftReportCashOper-calculate';
import { FindMethodsShiftReportCashOperUseCase } from '@finance/shiftReport/shiftReportCashOper/use-cases/shiftReportCashOper-find-methods';
import { DeleteCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-delete';
import { GetOperDataShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-get-oper-data';
import { SendShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-send';
import { DeleteShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-delete';
import { GradingEstimationRepositoryProvider } from '@finance/shiftReport/gradingEstimation/provider/gradingEstimation';
import { GradingParameterRepositoryProvider } from '@finance/shiftReport/gradingParameter/provider/gradingParameter';
import { ShiftGradingRepositoryProvider } from '@finance/shiftReport/shiftGrading/provider/shiftGrading';
import { FindMethodsShiftGradingUseCase } from '@finance/shiftReport/shiftGrading/use-cases/shiftGrading-find-methods';
import { FindMethodsGradingParameterUseCase } from '@finance/shiftReport/gradingParameter/use-cases/gradingParameter-find-methods';
import { FindMethodsGradingEstimationUseCase } from '@finance/shiftReport/gradingEstimation/use-cases/gradingEstimation-find-methods';
import { FullDataShiftReportUseCase } from "@finance/shiftReport/shiftReport/use-cases/shiftReport-full-data";
import {
  CalculationPaymentShiftReportUseCase
} from "@finance/shiftReport/shiftReport/use-cases/shiftReport-calculation-payment";
import { CalculateDailyPayoutShiftReportUseCase } from "@finance/shiftReport/shiftReport/use-cases/shiftReport-calculate-daily-payout";

const repositories: Provider[] = [
  CashCollectionRepositoryProvider,
  CashCollectionDeviceRepositoryProvider,
  CashCollectionDeviceTypeRepositoryProvider,
  ShiftReportRepositoryProvider,
  ShiftReportCashOperRepositoryProvider,
  GradingEstimationRepositoryProvider,
  GradingParameterRepositoryProvider,
  ShiftGradingRepositoryProvider,
];

const cashCollectionUseCase: Provider[] = [
  CreateCashCollectionUseCase,
  UpdateCashCollectionUseCase,
  FindMethodsCashCollectionUseCase,
  RecalculateCashCollectionUseCase,
  GetAllByFilterCashCollectionUseCase,
  GetOneFullDataCashCollectionUseCase,
  DeleteCashCollectionUseCase,
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
  FindMethodsShiftReportUseCase,
  GetOperDataShiftReportUseCase,
  ReceiverShiftReportUseCase,
  UpdateShiftReportUseCase,
  SendShiftReportUseCase,
  FullDataShiftReportUseCase,
  CalculationPaymentShiftReportUseCase,
  CalculateDailyPayoutShiftReportUseCase,
  DeleteShiftReportUseCase,
];

const shiftReportCashOperUseCase: Provider[] = [
  CreateShiftReportCashOperUseCase,
  CalculateShiftReportCashOperUseCase,
  FindMethodsShiftReportCashOperUseCase,
];

const shiftGradingUseCase: Provider[] = [
  FindMethodsShiftGradingUseCase,
  FindMethodsGradingParameterUseCase,
  FindMethodsGradingEstimationUseCase,
];
@Module({
  imports: [PrismaModule, BusinessCoreModule, HrCoreModule],
  providers: [
    ...repositories,
    ...cashCollectionUseCase,
    ...cashCollectionDeviceUseCase,
    ...cashCollectionDeviceTypeUseCase,
    ...shiftReportUseCase,
    ...shiftReportCashOperUseCase,
    ...shiftGradingUseCase,
  ],
  exports: [
    ...cashCollectionUseCase,
    ...cashCollectionDeviceUseCase,
    ...cashCollectionDeviceTypeUseCase,
    ...shiftReportUseCase,
    ...shiftReportCashOperUseCase,
  ],
})
export class FinanceCoreModule {}
