import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { ITransactionService } from '../domain/transaction.service.interface';

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async executeTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(callback);
  }
}
