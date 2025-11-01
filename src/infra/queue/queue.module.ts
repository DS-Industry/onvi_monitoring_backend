import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IFLOW_PRODUCER } from '@loyalty/order/interface/flow-producer.interface';
import { BullMQFlowProducer } from './flow-producer.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IFLOW_PRODUCER,
      useClass: BullMQFlowProducer,
    },
  ],
  exports: [IFLOW_PRODUCER],
})
export class QueueModule {}

