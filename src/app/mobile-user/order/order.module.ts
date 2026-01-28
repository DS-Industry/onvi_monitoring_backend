import { Module } from '@nestjs/common';
import { OrderController } from './controller/order';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { PosModule } from '@infra/pos/pos.module';
import { PaymentModule } from '../../payment/payment.module';
import { GetLatestCarwashesUseCase } from './use-cases/get-latest-carwashes.use-case';

@Module({
  imports: [LoyaltyCoreModule, PosModule, PaymentModule],
  controllers: [OrderController],
  providers: [GetLatestCarwashesUseCase],
})
export class MobileOrderModule {}
