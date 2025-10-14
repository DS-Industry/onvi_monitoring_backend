import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IClientRepository } from '../domain/client.repository.interface';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<any | null> {
    return await this.prisma.lTYUser.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: number, status: string, tx?: any): Promise<void> {
    const client = tx || this.prisma;
    await client.lTYUser.update({
      where: { id },
      data: { status },
    });
  }
}
