import { Injectable } from '@nestjs/common';
import { IClientRepository } from '@mobile-user/client/interfaces/client';
import { PrismaService } from '@db/prisma/prisma.service';
import { Client } from '@mobile-user/client/domain/client';
import { PrismaMobileUserMapper } from '@db/mapper/prisma-mobile-user-mapper';

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

  public async update(id: number, input: Client): Promise<Client> {
    const clientPrismaEntity = PrismaMobileUserMapper.toPrisma(input);
    const admin = await this.prisma.mobileUser.update({
      where: {
        id: id,
      },
      data: clientPrismaEntity,
    });
    return PrismaMobileUserMapper.toDomain(admin);
  }
}
