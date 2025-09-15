import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IClientMetaRepository } from '../domain/client-meta.repository.interface';
import { ClientMeta } from '../domain/client-meta.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientMetaRepository implements IClientMetaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(meta: ClientMeta): Promise<ClientMeta> {
    const createdMeta = await this.prisma.lTYUserMeta.create({
      data: {
        clientId: meta.clientId,
        deviceId: meta.deviceId,
        model: meta.model,
        name: meta.name,
        platform: meta.platform,
      },
    });
    return ClientMeta.fromPrisma(createdMeta);
  }

  async findById(id: number): Promise<ClientMeta | null> {
    const meta = await this.prisma.lTYUserMeta.findUnique({
      where: { id },
    });
    return meta ? ClientMeta.fromPrisma(meta) : null;
  }

  async findByClientId(clientId: number): Promise<ClientMeta | null> {
    const meta = await this.prisma.lTYUserMeta.findFirst({
      where: { clientId },
    });
    return meta ? ClientMeta.fromPrisma(meta) : null;
  }

  async update(meta: ClientMeta): Promise<ClientMeta> {
    const updatedMeta = await this.prisma.lTYUserMeta.update({
      where: { id: meta.id },
      data: meta.toPrismaForUpdate(),
    });
    return ClientMeta.fromPrisma(updatedMeta);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.lTYUserMeta.delete({
      where: { id },
    });
  }
}
