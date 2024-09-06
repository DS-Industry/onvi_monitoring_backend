import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { CurrencyRepositoryProvide } from '@device/currency/currency/provider/currency';
import { CurrencyCreate } from '@device/currency/currency/use-case/currency-create';
import { GetByIdCurrencyUseCase } from '@device/currency/currency/use-case/currency-get-by-id';

@Module({
  imports: [PrismaModule],
  providers: [
    CurrencyRepositoryProvide,
    CurrencyCreate,
    GetByIdCurrencyUseCase,
  ],
  exports: [GetByIdCurrencyUseCase],
})
export class CurrencyModule {}
