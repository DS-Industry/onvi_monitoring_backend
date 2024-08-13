import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { CurrencyRepositoryProvide } from '@device/currency/currency/provider/currency';
import { CurrencyCreate } from '@device/currency/currency/use-case/currency-create';

@Module({
  imports: [PrismaModule],
  providers: [CurrencyRepositoryProvide, CurrencyCreate],
  exports: [],
})
export class CurrencyModule {}
