import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { CardController } from './controller/card.controller';
import { CardService } from './services/card.service';
import { GetCardOrdersUseCase } from './use-cases/get-card-orders.use-case';
import { GetCardFreeVacuumUseCase } from './use-cases/get-card-free-vacuum.use-case';
import { GetCardTariffUseCase } from './use-cases/get-card-tariff.use-case';
import { GetCardTransferDataUseCase } from './use-cases/get-card-transfer-data.use-case';
import { PostCardTransferUseCase } from './use-cases/post-card-transfer.use-case';
import { GetCardVacuumHistoryUseCase } from './use-cases/get-card-vacuum-history.use-case';
import { CardRepository } from './infrastructure/card.repository';
import { OrderRepository } from './infrastructure/order.repository';
import { ClientRepository } from './infrastructure/client.repository';
import { BonusOperRepository } from './infrastructure/bonus-oper.repository';
import { TransactionService } from './infrastructure/transaction.service';
import { CardHistoryRepository } from './repository/card-history.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CardController],
  providers: [
    CardService,
    GetCardOrdersUseCase,
    GetCardFreeVacuumUseCase,
    GetCardTariffUseCase,
    GetCardTransferDataUseCase,
    PostCardTransferUseCase,
    GetCardVacuumHistoryUseCase,
    CardRepository,
    OrderRepository,
    ClientRepository,
    BonusOperRepository,
    TransactionService,
    CardHistoryRepository,
    {
      provide: 'ICardRepository',
      useClass: CardRepository,
    },
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    {
      provide: 'IClientRepository',
      useClass: ClientRepository,
    },
    {
      provide: 'IBonusOperRepository',
      useClass: BonusOperRepository,
    },
    {
      provide: 'ITransactionService',
      useClass: TransactionService,
    },
  ],
  exports: [CardService],
})
export class CardModule {}
