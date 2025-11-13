import { Module } from '@nestjs/common';
import { OrderController } from './controller/order';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { PosModule } from '@infra/pos/pos.module';
import { PaymentModule } from '../../payment/payment.module';
@Module({
  imports: [LoyaltyCoreModule, PosModule, PaymentModule],
  controllers: [OrderController],
  providers: [],
})
export class MobileOrderModule {}
