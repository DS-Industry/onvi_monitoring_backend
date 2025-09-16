import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IClientRepository } from '../domain/client.repository.interface';
import { Client } from '../domain/client.entity';
import { LTYUser, StatusUser, ContractType } from '@prisma/client';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(client: Client): Promise<Client> {
    const ltyUser = await this.prisma.lTYUser.create({
      data: {
        name: client.name,
        birthday: client.birthday,
        phone: client.phone,
        email: client.email,
        gender: client.gender,
        status: client.status,
        avatar: client.avatar,
        contractType: client.contractType,
        comment: client.comment,
        placementId: client.placementId,
        workerCorporateId: client.workerCorporateId,
        refreshTokenId: client.refreshTokenId,
      },
    });

    return Client.fromPrisma(ltyUser);
  }

  async findById(id: number): Promise<Client | null> {
    const ltyUser = await this.prisma.lTYUser.findFirst({
      where: { id },
      include: {
        meta: true,
        tags: true,
        card: true,
      },
    });

    if (!ltyUser) return null;
    return Client.fromPrisma(ltyUser);
  }

  async findByPhone(phone: string): Promise<Client | null> {
    const ltyUser = await this.prisma.lTYUser.findFirst({
      where: { phone },
      include: {
        meta: true,
        tags: true,
        card: true,
      },
    });

    if (!ltyUser) return null;
    return Client.fromPrisma(ltyUser);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const ltyUser = await this.prisma.lTYUser.findFirst({
      where: { email },
      include: {
        meta: true,
        tags: true,
        card: true,
      },
    });

    if (!ltyUser) return null;
    return Client.fromPrisma(ltyUser);
  }

  async update(client: Client): Promise<Client> {
    const ltyUser = await this.prisma.lTYUser.update({
      where: { id: client.id },
      data: {
        name: client.name,
        birthday: client.birthday,
        phone: client.phone,
        email: client.email,
        gender: client.gender,
        status: client.status,
        avatar: client.avatar,
        contractType: client.contractType,
        comment: client.comment,
        placementId: client.placementId,
        workerCorporateId: client.workerCorporateId,
        refreshTokenId: client.refreshTokenId,
        is_notifications_enabled: client.is_notifications_enabled,
        updatedAt: new Date(),
      },
      include: {
        meta: true,
        tags: true,
        card: true,
      },
    });

    return Client.fromPrisma(ltyUser);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.lTYUser.delete({
      where: { id },
    });
  }

  async setRefreshToken(phone: string, token: string): Promise<void> {
    await this.prisma.lTYUser.update({
      where: { phone },
      data: { refreshTokenId: token },
    });
  }

  async findMany(filters?: {
    status?: string;
    contractType?: string;
    placementId?: number;
    limit?: number;
    offset?: number;
  }): Promise<Client[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status as StatusUser;
    }

    if (filters?.contractType) {
      where.contractType = filters.contractType as ContractType;
    }

    if (filters?.placementId) {
      where.placementId = filters.placementId;
    }

    const ltyUsers = await this.prisma.lTYUser.findMany({
      where,
      include: {
        meta: true,
        tags: true,
        card: true,
      },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
      orderBy: { createdAt: 'desc' },
    });

    return ltyUsers.map(user => Client.fromPrisma(user));
  }
}
