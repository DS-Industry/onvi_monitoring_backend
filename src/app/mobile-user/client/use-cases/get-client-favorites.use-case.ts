import { Injectable } from '@nestjs/common';
import { ClientFavoritesRepository } from '../infrastructure/client-favorites.repository';

@Injectable()
export class GetClientFavoritesUseCase {
  constructor(private readonly clientFavoritesRepository: ClientFavoritesRepository) {}

  async execute(clientId: number): Promise<number[]> {
    return await this.clientFavoritesRepository.getFavorites(clientId);
  }
}
