import { Module } from '@nestjs/common';
import { AddressRepositoryProvider } from '@address/provider/address';
import { CreateAddressUseCase } from '@address/use-case/address-create';
import { PrismaModule } from '@db/prisma/prisma.module';
import { GetByIdAddressUseCase } from '@address/use-case/address-get-by-id';

@Module({
  imports: [PrismaModule],
  providers: [
    AddressRepositoryProvider,
    CreateAddressUseCase,
    GetByIdAddressUseCase,
  ],
  exports: [
    AddressRepositoryProvider,
    CreateAddressUseCase,
    GetByIdAddressUseCase,
  ],
})
export class AddressModule {}
