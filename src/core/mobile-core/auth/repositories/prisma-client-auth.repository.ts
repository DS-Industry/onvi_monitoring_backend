import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IClientAuthRepository } from '../interfaces/client-auth-repository';
import { ClientSession } from '../domain/client-session';

@Injectable()
export class PrismaClientAuthRepository extends IClientAuthRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findSessionByClientId(clientId: number): Promise<ClientSession> {
    const user = await this.prisma.lTYUser.findUnique({
      where: { id: clientId },
    });

    if (!user || !user.refreshTokenId) {
      return null;
    }

    return new ClientSession({
      id: user.id,
      clientId: user.id,
      phone: user.phone,
      refreshToken: user.refreshTokenId,
      isActive: user.status === 'ACTIVE',
      lastLoginAt: user.updatedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findSessionByPhone(phone: string): Promise<ClientSession> {
    const user = await this.prisma.lTYUser.findUnique({
      where: { phone },
    });

    if (!user || !user.refreshTokenId) {
      return null;
    }

    return new ClientSession({
      id: user.id,
      clientId: user.id,
      phone: user.phone,
      refreshToken: user.refreshTokenId,
      isActive: user.status === 'ACTIVE',
      lastLoginAt: user.updatedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async createSession(session: ClientSession): Promise<ClientSession> {
    const updated = await this.prisma.lTYUser.update({
      where: { id: session.clientId },
      data: {
        refreshTokenId: session.refreshToken,
        updatedAt: new Date(),
      },
    });

    return new ClientSession({
      id: updated.id,
      clientId: updated.id,
      phone: updated.phone,
      refreshToken: updated.refreshTokenId,
      isActive: updated.status === 'ACTIVE',
      lastLoginAt: updated.updatedAt,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async updateSession(session: ClientSession): Promise<ClientSession> {
    const updated = await this.prisma.lTYUser.update({
      where: { id: session.clientId },
      data: {
        refreshTokenId: session.refreshToken,
        updatedAt: new Date(),
      },
    });

    return new ClientSession({
      id: updated.id,
      clientId: updated.id,
      phone: updated.phone,
      refreshToken: updated.refreshTokenId,
      isActive: updated.status === 'ACTIVE',
      lastLoginAt: updated.updatedAt,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async deleteSession(clientId: number): Promise<void> {
    await this.prisma.lTYUser.update({
      where: { id: clientId },
      data: { refreshTokenId: null },
    });
  }

  async findActiveSessionByRefreshToken(refreshToken: string): Promise<ClientSession> {
    const user = await this.prisma.lTYUser.findFirst({
      where: {
        refreshTokenId: refreshToken,
        status: 'ACTIVE',
      },
    });

    if (!user) {
      return null;
    }

    return new ClientSession({
      id: user.id,
      clientId: user.id,
      phone: user.phone,
      refreshToken: user.refreshTokenId,
      isActive: user.status === 'ACTIVE',
      lastLoginAt: user.updatedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
