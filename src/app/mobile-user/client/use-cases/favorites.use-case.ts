import { Injectable } from '@nestjs/common';
import { IFavoritesRepository } from '@loyalty/mobile-user/client/interfaces/favorites';
import { AccountFavoritesDto } from '../controller/dto/account-favorites.dto';

@Injectable()
export class FavoritesUseCase {
  constructor(
    private readonly favoritesRepository: IFavoritesRepository,
  ) {}

  async getFavoritesByClientId(clientId: number): Promise<number[]> {
    return await this.favoritesRepository.findAllCarwashIdsByClientId(clientId);
  }

  async addFavoritesByClientId(
    body: AccountFavoritesDto,
    clientId: number,
  ): Promise<number[]> {
    return await this.favoritesRepository.addCarwashIdByClientId(
      body.carWashId,
      clientId,
    );
  }

  async removeFavoriteByClientId(
    body: AccountFavoritesDto,
    clientId: number,
  ): Promise<number[]> {
    return await this.favoritesRepository.removeCarwashIdByClientId(
      body.carWashId,
      clientId,
    );
  }
}
