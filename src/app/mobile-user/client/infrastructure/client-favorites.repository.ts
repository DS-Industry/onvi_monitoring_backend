import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IClientFavoritesRepository } from '../domain/client-favorites.repository.interface';

@Injectable()
export class ClientFavoritesRepository implements IClientFavoritesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFavorites(clientId: number): Promise<number[]> {
    //TODO: Implement this
    return [];
  }

  async addFavorite(clientId: number, carwashId: number): Promise<number[]> {
    //TODO: Implement this
    return [];
  }

  async removeFavorite(clientId: number, carwashId: number): Promise<number[]> {
    //TODO: Implement this
    return [];
  }
}
