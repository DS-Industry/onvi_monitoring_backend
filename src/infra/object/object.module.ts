import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ObjectPermissionsRepositoryProvider } from './provider/object';
import { GetByIdObjectUseCase } from './use-case/object-get-by-id';

@Module({
  imports: [PrismaModule],
  providers: [ObjectPermissionsRepositoryProvider, GetByIdObjectUseCase],
  exports: [GetByIdObjectUseCase],
})
export class ObjectModule {}
