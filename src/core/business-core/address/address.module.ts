import { Module } from '@nestjs/common';
import { AddressRepositoryProvider } from './provider/address';
import { PrismaModule } from '@db/prisma/prisma.module';
import { GetByIdAddressUseCase } from './use-case/address-get-by-id';
import { PlacementRepositoryProvider } from '@business-core/placement/provider/placement';
import { FindMethodsPlacementUseCase } from '@business-core/placement/use-case/placement-find-methods';

@Module({
  imports: [PrismaModule],
  providers: [
    AddressRepositoryProvider,
    PlacementRepositoryProvider,
    FindMethodsPlacementUseCase,
    GetByIdAddressUseCase,
  ],
  exports: [
    AddressRepositoryProvider,
    PlacementRepositoryProvider,
    FindMethodsPlacementUseCase,
    GetByIdAddressUseCase,
  ],
})
export class AddressModule {}
