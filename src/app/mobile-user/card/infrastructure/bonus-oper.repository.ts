import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IBonusOperRepository } from '../domain/bonus-oper.repository.interface';

@Injectable()
export class BonusOperRepository implements IBonusOperRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    cardId: number;
    operDate: Date;
    loadDate: Date;
    sum: number;
    comment: string;
    creatorId: number;
    typeId: number;
  }, tx?: any): Promise<void> {
    const client = tx || this.prisma;
    await client.lTYBonusOper.create({
      data,
    });
  }
}
