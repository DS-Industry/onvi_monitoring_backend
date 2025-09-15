import { Injectable } from '@nestjs/common';
import { ClientFavoritesRepository } from '../infrastructure/client-favorites.repository';
import { ClientFavoritesDto } from '../controller/dto/client-favorites.dto';

@Injectable()
export class AddClientFavoriteUseCase {
  constructor(private readonly clientFavoritesRepository: ClientFavoritesRepository) {}

  async execute(clientId: number, dto: ClientFavoritesDto): Promise<number[]> {
    return await this.clientFavoritesRepository.addFavorite(clientId, dto.carwashId);
  }
}
