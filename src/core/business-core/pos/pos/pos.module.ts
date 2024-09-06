import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { PosRepositoryProvider } from '@pos/pos/provider/pos';
import { CreatePosUseCase } from '@pos/pos/use-cases/pos-create';
import { AddressModule } from '@address/address.module';
import { GetByIdPosUseCase } from '@pos/pos/use-cases/pos-get-by-id';
import { CarWashPosModule } from '@pos/carWashPos/carWashPos.module';
import { CreateFullDataPosUseCase } from '@pos/pos/use-cases/pos-create-full-data';
import { GetAllPosUseCase } from "@pos/pos/use-cases/pos-get-all";

@Module({
  imports: [PrismaModule, AddressModule, CarWashPosModule],
  providers: [
    PosRepositoryProvider,
    CreatePosUseCase,
    GetByIdPosUseCase,
    CreateFullDataPosUseCase,
    GetAllPosUseCase,
  ],
  exports: [
    CreatePosUseCase,
    GetByIdPosUseCase,
    CreateFullDataPosUseCase,
    CarWashPosModule,
    GetAllPosUseCase,
  ],
})
export class PosModule {}
