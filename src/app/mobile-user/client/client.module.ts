import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientController } from '@mobile-user/client/controller/client';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { ClientMetaRepository } from './infrastructure/client-meta.repository';
import { ClientFavoritesRepository } from './infrastructure/client-favorites.repository';
import { UpdateAccountUseCase } from './use-cases/update-account.use-case';
import { GetCurrentAccountUseCase } from './use-cases/get-current-account.use-case';
import { CreateClientMetaUseCase } from './use-cases/create-client-meta.use-case';
import { UpdateClientMetaUseCase } from './use-cases/update-client-meta.use-case';
import { GetClientFavoritesUseCase } from './use-cases/get-client-favorites.use-case';
import { AddClientFavoriteUseCase } from './use-cases/add-client-favorite.use-case';
import { RemoveClientFavoriteUseCase } from './use-cases/remove-client-favorite.use-case';
import { GetActivePromotionsUseCase } from './use-cases/get-active-promotions.use-case';

@Module({
  imports: [LoyaltyCoreModule, HttpModule],
  controllers: [ClientController],
  providers: [
    ClientMetaRepository,
    ClientFavoritesRepository,
    UpdateAccountUseCase,
    GetCurrentAccountUseCase,
    CreateClientMetaUseCase,
    UpdateClientMetaUseCase,
    GetClientFavoritesUseCase,
    AddClientFavoriteUseCase,
    RemoveClientFavoriteUseCase,
    GetActivePromotionsUseCase,
  ],
  exports: [
    ClientMetaRepository,
    ClientFavoritesRepository,
    UpdateAccountUseCase,
    GetCurrentAccountUseCase,
    CreateClientMetaUseCase,
    UpdateClientMetaUseCase,
    GetClientFavoritesUseCase,
    AddClientFavoriteUseCase,
    RemoveClientFavoriteUseCase,
    GetActivePromotionsUseCase,
  ],
})
export class ClientModule {}
