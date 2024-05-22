import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ClientRepositoryProvider } from '@mobile-user/client/provider/client';
import { ClientController } from '@mobile-user/client/controller/client';
import { UpdateClientUseCase } from '@mobile-user/client/use-cases/client-update';
import { GetByIdClientUseCase } from '@mobile-user/client/use-cases/client-get-by-id';

@Module({
  imports: [PrismaModule],
  controllers: [ClientController],
  providers: [
    ClientRepositoryProvider,
    UpdateClientUseCase,
    GetByIdClientUseCase,
  ],
  exports: [ClientRepositoryProvider, UpdateClientUseCase],
})
export class ClientModule {}
