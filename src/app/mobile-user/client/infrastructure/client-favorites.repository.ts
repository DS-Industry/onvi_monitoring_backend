import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IClientFavoritesRepository } from '../domain/client-favorites.repository.interface';

@Injectable()
export class ClientFavoritesRepository implements IClientFavoritesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFavorites(clientId: number): Promise<number[]> {
    // For now, we'll return an empty array since there's no dedicated favorites table
    // This could be implemented by adding a favorites field to LTYUser or creating a separate table
    return [];
  }

  async addFavorite(clientId: number, carwashId: number): Promise<number[]> {
    // For now, we'll return an empty array since there's no dedicated favorites table
    // This could be implemented by adding a favorites field to LTYUser or creating a separate table
    return [];
  }

  async removeFavorite(clientId: number, carwashId: number): Promise<number[]> {
    // For now, we'll return an empty array since there's no dedicated favorites table
    // This could be implemented by adding a favorites field to LTYUser or creating a separate table
    return [];
  }
}
