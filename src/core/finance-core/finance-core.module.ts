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
import {
  FindMethodsCashCollectionUseCase
} from "@finance/cashCollection/cashCollection/use-cases/cashCollection-find-methods";
import {
  RecalculateCashCollectionUseCase
} from "@finance/cashCollection/cashCollection/use-cases/cashCollection-recalculate";
import {
  UpdateCashCollectionDeviceUseCase
} from "@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-update";
import {
  UpdateManyCashCollectionDeviceUseCase
} from "@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-update-many";
import {
  UpdateCashCollectionTypeUseCase
} from "@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-update";
import {
  UpdateManyCashCollectionTypeUseCase
} from "@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-update-many";
import {
  GetAllByFilterCashCollectionUseCase
} from "@finance/cashCollection/cashCollection/use-cases/cashCollection-get-all-by-filter";
import {
  GetOneFullDataCashCollectionUseCase
} from "@finance/cashCollection/cashCollection/use-cases/cashCollection-get-one-full-data";

const repositories: Provider[] = [
  CashCollectionRepositoryProvider,
  CashCollectionDeviceRepositoryProvider,
  CashCollectionDeviceTypeRepositoryProvider,
];

const cashCollectionUseCase: Provider[] = [
  CreateCashCollectionUseCase,
  UpdateCashCollectionUseCase,
  FindMethodsCashCollectionUseCase,
  RecalculateCashCollectionUseCase,
  GetAllByFilterCashCollectionUseCase,
  GetOneFullDataCashCollectionUseCase,
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

@Module({
  imports: [PrismaModule, BusinessCoreModule],
  providers: [
    ...repositories,
    ...cashCollectionUseCase,
    ...cashCollectionDeviceUseCase,
    ...cashCollectionDeviceTypeUseCase,
  ],
  exports: [
    ...cashCollectionUseCase,
    ...cashCollectionDeviceUseCase,
    ...cashCollectionDeviceTypeUseCase,
  ],
})
export class FinanceCoreModule {}
