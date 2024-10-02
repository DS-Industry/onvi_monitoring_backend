import { Module } from '@nestjs/common';
import { AddressRepositoryProvider } from './provider/address';
import { PrismaModule } from '@db/prisma/prisma.module';
import { GetByIdAddressUseCase } from './use-case/address-get-by-id';

@Module({
  imports: [PrismaModule],
  providers: [
    AddressRepositoryProvider,
    GetByIdAddressUseCase,
  ],
  exports: [
    AddressRepositoryProvider,
    GetByIdAddressUseCase,
  ],
})
export class AddressModule {}
