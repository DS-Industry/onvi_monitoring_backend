import { Injectable } from '@nestjs/common';
import { IClientMetaRepository } from '../interfaces/clientMeta';
import { PrismaService } from '@db/prisma/prisma.service';
import { ClientMeta } from '../domain/clientMeta';
import { PrismaMobileUserMapper } from '@db/mapper/prisma-mobile-user-mapper';

@Injectable()
export class ClientMetaRepository extends IClientMetaRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: ClientMeta): Promise<ClientMeta> {
    const clientMetaPrismaEntity =
      PrismaMobileUserMapper.toPrismaClientMeta(input);
    const clientMeta = await this.prisma.lTYUserMeta.create({
      data: clientMetaPrismaEntity,
    });
    return PrismaMobileUserMapper.toDomainClientMeta(clientMeta);
  }

  public async createMany(input: ClientMeta[]): Promise<ClientMeta[]> {
    const clientMetaPrismaEntities = input.map((meta) =>
      PrismaMobileUserMapper.toPrismaClientMeta(meta),
    );

    await this.prisma.lTYUserMeta.createMany({
      data: clientMetaPrismaEntities,
    });
    // Note: createMany doesn't return the created entities, so we return the input
    return input;
  }

  public async findOneById(id: number): Promise<ClientMeta> {
    const clientMeta = await this.prisma.lTYUserMeta.findFirst({
      where: {
        id,
      },
    });
    return PrismaMobileUserMapper.toDomainClientMeta(clientMeta);
  }

  public async findOneByClientId(clientId: number): Promise<ClientMeta> {
    const clientMeta = await this.prisma.lTYUserMeta.findFirst({
      where: {
        clientId,
      },
    });
    return PrismaMobileUserMapper.toDomainClientMeta(clientMeta);
  }

  public async findOneByDeviceId(deviceId: number): Promise<ClientMeta> {
    const clientMeta = await this.prisma.lTYUserMeta.findFirst({
      where: {
        deviceId,
      },
    });
    return PrismaMobileUserMapper.toDomainClientMeta(clientMeta);
  }

  public async findAll(): Promise<ClientMeta[]> {
    const clientMetas = await this.prisma.lTYUserMeta.findMany();
    return clientMetas.map((item) =>
      PrismaMobileUserMapper.toDomainClientMeta(item),
    );
  }

  public async update(input: ClientMeta): Promise<ClientMeta> {
    const clientMetaPrismaEntity =
      PrismaMobileUserMapper.toPrismaClientMeta(input);
    const clientMeta = await this.prisma.lTYUserMeta.update({
      where: {
        id: input.id,
      },
      data: clientMetaPrismaEntity,
    });
    return PrismaMobileUserMapper.toDomainClientMeta(clientMeta);
  }

  public async remove(id: number): Promise<any> {
    await this.prisma.lTYUserMeta.delete({
      where: {
        id,
      },
    });
    return { success: true };
  }

  public async removeByClientId(clientId: number): Promise<any> {
    await this.prisma.lTYUserMeta.deleteMany({
      where: {
        clientId,
      },
    });
    return { success: true };
  }
}
