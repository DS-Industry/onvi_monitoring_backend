import { Module } from '@nestjs/common';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { CardController } from './controller/card';
import { GetCardTransactionsHistoryUseCase } from './use-cases/get-card-transactions-history.use-case';
import { GetFreeVacuumUseCase } from './use-cases/get-free-vacuum.use-case';
import { GetCardTariffUseCase } from './use-cases/get-card-tariff.use-case';
import { GetAccountTransferDataUseCase } from './use-cases/get-account-transfer-data.use-case';
import { TransferAccountUseCase } from './use-cases/transfer-account.use-case';

@Module({
  imports: [LoyaltyCoreModule],
  controllers: [CardController],
  providers: [
    GetCardTransactionsHistoryUseCase,
    GetFreeVacuumUseCase,
    GetCardTariffUseCase,
    GetAccountTransferDataUseCase,
    TransferAccountUseCase,
  ],
  exports: [
    GetCardTransactionsHistoryUseCase,
    GetFreeVacuumUseCase,
    GetCardTariffUseCase,
    GetAccountTransferDataUseCase,
    TransferAccountUseCase,
  ],
})
export class CardModule {}
