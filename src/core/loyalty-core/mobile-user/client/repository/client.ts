import { Injectable } from '@nestjs/common';
import { IClientRepository } from '../interfaces/client';
import { PrismaService } from '@db/prisma/prisma.service';
import { Client } from '../domain/client';
import { PrismaMobileUserMapper } from '@db/mapper/prisma-mobile-user-mapper';
import { UserType } from '@prisma/client';

@Injectable()
export class ClientRepository extends IClientRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Client): Promise<Client> {
    const clientPrismaEntity = PrismaMobileUserMapper.toPrisma(input);
    const client = await this.prisma.mobileUser.create({
      data: clientPrismaEntity,
    });
    return PrismaMobileUserMapper.toDomain(client);
  }

  public async createMany(input: Client[]): Promise<Client[]> {
    return Promise.resolve([]);
  }

  public async findAll(): Promise<Client[]> {
    const clients = await this.prisma.mobileUser.findMany();
    return clients.map((item) => PrismaMobileUserMapper.toDomain(item));
  }

  public async findAllByFilter(
    placementId?: number,
    tagIds?: number[],
    type?: UserType,
    phone?: string,
    skip?: number,
    take?: number,
  ): Promise<Client[]> {
    const where: any = {};

    if (placementId !== undefined) {
      where.placementId = placementId;
    }

    if (type !== undefined) {
      where.type = type;
    }

    if (phone !== undefined) {
      where.phone = phone;
    }

    if (tagIds !== undefined && tagIds.length > 0) {
      where.tags = { some: { id: { in: tagIds } } };
    }

    const clients = await this.prisma.mobileUser.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where,
      orderBy: {
        id: 'asc',
      },
    });
    return clients.map((item) => PrismaMobileUserMapper.toDomain(item));
  }

  public async findOneById(id: number): Promise<Client> {
    const client = await this.prisma.mobileUser.findFirst({
      where: {
        id,
      },
    });
    return PrismaMobileUserMapper.toDomain(client);
  }

  public async findOneByPhone(phone: string): Promise<Client> {
    const client = await this.prisma.mobileUser.findFirst({
      where: {
        phone,
      },
    });
    return PrismaMobileUserMapper.toDomain(client);
  }

  public async remove(id: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async updateConnectionTag(
    userId: number,
    addTagIds: number[],
    deleteTagIds: number[],
  ): Promise<any> {
    await this.prisma.mobileUser.update({
      where: {
        id: userId,
      },
      data: {
        tags: {
          disconnect: deleteTagIds.map((id) => ({ id })),
          connect: addTagIds.map((id) => ({ id })),
        },
      },
    });
  }

  public async update(input: Client): Promise<Client> {
    const clientPrismaEntity = PrismaMobileUserMapper.toPrisma(input);
    const admin = await this.prisma.mobileUser.update({
      where: {
        id: input.id,
      },
      data: clientPrismaEntity,
    });
    return PrismaMobileUserMapper.toDomain(admin);
  }
}
