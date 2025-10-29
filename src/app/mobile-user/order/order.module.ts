import { Module } from '@nestjs/common';
import { OrderController } from './controller/order';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { PosModule } from '@infra/pos/pos.module';

@Module({
  imports: [LoyaltyCoreModule, PosModule],
  controllers: [OrderController],
})
export class MobileOrderModule {}

