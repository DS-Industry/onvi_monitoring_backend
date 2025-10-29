import { Module } from '@nestjs/common';
import { OrderController } from './controller/order';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';

@Module({
  imports: [LoyaltyCoreModule],
  controllers: [OrderController],
})
export class MobileOrderModule {}

