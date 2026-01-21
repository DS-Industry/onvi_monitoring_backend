import { Injectable } from '@nestjs/common';
import { IFavoritesRepository } from '../interfaces/favorites';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class FavoritesRepository extends IFavoritesRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAllCarwashIdsByClientId(clientId: number): Promise<number[]> {
    const favorites = await this.prisma.lTYUserFavorites.findMany({
      where: {
        clientId,
      },
      select: {
        posId: true,
      },
    });

    return favorites.map((favorite) => favorite.posId);
  }

  async addCarwashIdByClientId(
    carWashId: number,
    clientId: number,
  ): Promise<number[]> {
    const existingFavorite = await this.prisma.lTYUserFavorites.findUnique({
      where: {
        clientId_posId: {
          clientId,
          posId: carWashId,
        },
      },
    });

    if (existingFavorite) {
      return this.findAllCarwashIdsByClientId(clientId);
    }

    await this.prisma.lTYUserFavorites.create({
      data: {
        clientId,
        posId: carWashId,
      },
    });

    return this.findAllCarwashIdsByClientId(clientId);
  }

  async removeCarwashIdByClientId(
    carWashId: number,
    clientId: number,
  ): Promise<number[]> {
    await this.prisma.lTYUserFavorites.deleteMany({
      where: {
        clientId,
        posId: carWashId,
      },
    });

    return this.findAllCarwashIdsByClientId(clientId);
  }
}
