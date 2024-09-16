import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { CurrencyCarWashPosRepositoryProvider } from '@device/currency/currency-car-wash-pos/provider/currency-car-wash-pos';
import { GetByCarWashPosIdAndCurrencyIdCurrencyCarWashPosUseCase } from '@device/currency/currency-car-wash-pos/use-case/currency-car-wash-pos-get-by-car-wash-pos-id-and-currency-id';

@Module({
  imports: [PrismaModule],
  providers: [
    CurrencyCarWashPosRepositoryProvider,
    GetByCarWashPosIdAndCurrencyIdCurrencyCarWashPosUseCase,
  ],
  exports: [GetByCarWashPosIdAndCurrencyIdCurrencyCarWashPosUseCase],
})
export class CurrencyCarWashPosModule {}
