import { Module } from '@nestjs/common';
import { ClientController } from '@mobile-user/client/controller/client';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { UpdateAccountUseCase } from './use-cases/update-account.use-case';
import { GetCurrentAccountUseCase } from './use-cases/get-current-account.use-case';
import { CreateClientMetaUseCase } from './use-cases/create-client-meta.use-case';
import { UpdateClientMetaUseCase } from './use-cases/update-client-meta.use-case';
import { CreateClientUseCaseWrapper } from './use-cases/create-client.use-case';
import { UpdateClientUseCaseWrapper } from './use-cases/update-client.use-case';

@Module({
  imports: [LoyaltyCoreModule],
  controllers: [ClientController],
  providers: [
    UpdateAccountUseCase,
    GetCurrentAccountUseCase,
    CreateClientMetaUseCase,
    UpdateClientMetaUseCase,
    CreateClientUseCaseWrapper,
    UpdateClientUseCaseWrapper,
  ],
  exports: [
    UpdateAccountUseCase,
    GetCurrentAccountUseCase,
    CreateClientMetaUseCase,
    UpdateClientMetaUseCase,
    CreateClientUseCaseWrapper,
    UpdateClientUseCaseWrapper,
  ],
})
export class ClientModule {}
