import { Injectable } from '@nestjs/common';
import { IClientRepository } from '../interfaces/client';
import { PrismaService } from '@db/prisma/prisma.service';
import { Client } from '../domain/client';
import { PrismaMobileUserMapper } from '@db/mapper/prisma-mobile-user-mapper';
import { ContractType, Prisma } from '@prisma/client';

@Injectable()
export class ClientRepository extends IClientRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Client): Promise<Client> {
    const clientPrismaEntity = PrismaMobileUserMapper.toPrisma(input);
    const client = await this.prisma.lTYUser.create({
      data: clientPrismaEntity,
    });
    return PrismaMobileUserMapper.toDomain(client);
  }
  public async findAll(): Promise<Client[]> {
    const clients = await this.prisma.lTYUser.findMany();
    return clients.map((item) => PrismaMobileUserMapper.toDomain(item));
  }

  public async findAllByFilter(
    placementId?: number,
    tagIds?: number[],
    contractType?: ContractType,
    workerCorporateId?: number,
    organizationId?: number | null,
    phone?: string,
    skip?: number,
    take?: number,
    registrationFrom?: string,
    registrationTo?: string,
    search?: string,
  ): Promise<Client[]> {
    const where: Prisma.LTYUserWhereInput = {};

    if (registrationFrom || registrationTo) {
      where.createdAt = {};

      if (registrationFrom) {
        where.createdAt.gte = new Date(registrationFrom);
      }

      if (registrationTo) {
        where.createdAt.lte = new Date(registrationTo);
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { card: { number: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (placementId !== undefined && placementId !== null && typeof placementId === 'number') {
      where.placementId = placementId;
    }

    if (contractType !== undefined && contractType !== null) {
      where.contractType = contractType;
    }

    if (organizationId !== undefined && organizationId !== null) {
      where.card = {
        cardTier: {
          ltyProgram: {
            programParticipants: {
              some: {
                organizationId: organizationId,
                status: 'ACTIVE',
              },
            },
          },
        },
      };
    }

    if (workerCorporateId !== undefined && workerCorporateId !== null && typeof workerCorporateId === 'number') {
      where.workerCorporateId = workerCorporateId;
    }

    if (phone !== undefined) {
      where.phone = phone;
    }

    if (tagIds !== undefined && tagIds.length > 0) {
      const validTagIds = tagIds.filter(id => id !== null && id !== undefined && typeof id === 'number');
      if (validTagIds.length > 0) {
        where.tags = { some: { id: { in: validTagIds } } };
      }
    }

    const clients = await this.prisma.lTYUser.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where,
      orderBy: {
        id: 'asc',
      },
    });
    return clients.map((item) => PrismaMobileUserMapper.toDomain(item));
  }

  public async countByFilter(
    placementId?: number,
    tagIds?: number[],
    contractType?: ContractType,
    workerCorporateId?: number,
    organizationId?: number | null,
    phone?: string,
    registrationFrom?: string,
    registrationTo?: string,
    search?: string,
  ): Promise<number> {
    const where: Prisma.LTYUserWhereInput = {};

    if (registrationFrom || registrationTo) {
      where.createdAt = {};

      if (registrationFrom) {
        where.createdAt.gte = new Date(registrationFrom);
      }

      if (registrationTo) {
        where.createdAt.lte = new Date(registrationTo);
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { card: { number: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (placementId !== undefined && placementId !== null && typeof placementId === 'number') {
      where.placementId = placementId;
    }

    if (contractType !== undefined && contractType !== null) {
      where.contractType = contractType;
    }

    if (organizationId !== undefined && organizationId !== null) {
      where.card = {
        cardTier: {
          ltyProgram: {
            programParticipants: {
              some: {
                organizationId: organizationId,
                status: 'ACTIVE',
              },
            },
          },
        },
      };
    }

    if (workerCorporateId !== undefined && workerCorporateId !== null && typeof workerCorporateId === 'number') {
      where.workerCorporateId = workerCorporateId;
    }

    if (phone !== undefined) {
      where.phone = phone;
    }

    if (tagIds !== undefined && tagIds.length > 0) {
      where.tags = { some: { id: { in: tagIds } } };
    }

    return await this.prisma.lTYUser.count({ where });
  }

  public async findOneById(id: number): Promise<Client> {
    const client = await this.prisma.lTYUser.findFirst({
      where: {
        id,
      },
      include: {
        card: true
      }
    });
    return PrismaMobileUserMapper.toDomain(client);
  }

  public async findOneByPhone(phone: string): Promise<Client> {
    const client = await this.prisma.lTYUser.findFirst({
      where: {
        phone,
      },
      include: {
        meta: true,
        card: true,
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
    await this.prisma.lTYUser.update({
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
    const admin = await this.prisma.lTYUser.update({
      where: {
        id: input.id,
      },
      data: clientPrismaEntity,
    });
    return PrismaMobileUserMapper.toDomain(admin);
  }
}
