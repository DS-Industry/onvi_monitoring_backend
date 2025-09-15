import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ClientController } from '@mobile-user/client/controller/client';
import { FileModule } from '@libs/file/module';
import { ClientRepository } from './infrastructure/client.repository';
import { ClientMetaRepository } from './infrastructure/client-meta.repository';
import { ClientFavoritesRepository } from './infrastructure/client-favorites.repository';
import { GetClientByIdUseCase } from './use-cases/get-client-by-id.use-case';
import { CreateClientUseCase } from './use-cases/create-client.use-case';
import { UpdateClientUseCase } from './use-cases/update-client.use-case';
import { DeleteClientUseCase } from './use-cases/delete-client.use-case';
import { GetCurrentAccountUseCase } from './use-cases/get-current-account.use-case';
import { CreateClientMetaUseCase } from './use-cases/create-client-meta.use-case';
import { UpdateClientMetaUseCase } from './use-cases/update-client-meta.use-case';
import { GetClientFavoritesUseCase } from './use-cases/get-client-favorites.use-case';
import { AddClientFavoriteUseCase } from './use-cases/add-client-favorite.use-case';
import { RemoveClientFavoriteUseCase } from './use-cases/remove-client-favorite.use-case';
import { GetActivePromotionsUseCase } from './use-cases/get-active-promotions.use-case';

@Module({
  imports: [PrismaModule, FileModule],
  controllers: [ClientController],
  providers: [
    ClientRepository,
    ClientMetaRepository,
    ClientFavoritesRepository,
    GetClientByIdUseCase,
    CreateClientUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
    GetCurrentAccountUseCase,
    CreateClientMetaUseCase,
    UpdateClientMetaUseCase,
    GetClientFavoritesUseCase,
    AddClientFavoriteUseCase,
    RemoveClientFavoriteUseCase,
    GetActivePromotionsUseCase,
  ],
  exports: [
    ClientRepository,
    ClientMetaRepository,
    ClientFavoritesRepository,
    GetClientByIdUseCase,
    CreateClientUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
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
