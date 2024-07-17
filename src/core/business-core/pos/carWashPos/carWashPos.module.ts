import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { CarWashPosProvider } from '@pos/carWashPos/provider/carWashPos';
import { CreateCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-create';
import { GetByPosIdCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-get-by-pos-id';

@Module({
  imports: [PrismaModule],
  providers: [
    CarWashPosProvider,
    CreateCarWashPosUseCase,
    GetByPosIdCarWashPosUseCase,
  ],
  exports: [CreateCarWashPosUseCase, GetByPosIdCarWashPosUseCase],
})
export class CarWashPosModule {}
