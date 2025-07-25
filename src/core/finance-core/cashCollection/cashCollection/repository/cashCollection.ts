import { Injectable } from '@nestjs/common';
import { ICashCollectionRepository } from '@finance/cashCollection/cashCollection/interface/cashCollection';
import { PrismaService } from '@db/prisma/prisma.service';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';
import { PrismaCashCollectionMapper } from '@db/mapper/prisma-cash-collection-mapper';
import { StatusCashCollection } from '@prisma/client';

@Injectable()
export class CashCollectionRepository extends ICashCollectionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: CashCollection): Promise<CashCollection> {
    const cashCollectionEntity = PrismaCashCollectionMapper.toPrisma(input);
    const cashCollection = await this.prisma.cashCollection.create({
      data: cashCollectionEntity,
    });
    return PrismaCashCollectionMapper.toDomain(cashCollection);
  }

  public async findOneById(id: number): Promise<CashCollection> {
    const cashCollection = await this.prisma.cashCollection.findFirst({
      where: {
        id,
      },
    });
    return PrismaCashCollectionMapper.toDomain(cashCollection);
  }

  public async findLastSendByPosId(posId: number): Promise<CashCollection> {
    const cashCollection = await this.prisma.cashCollection.findFirst({
      where: {
        posId,
        status: StatusCashCollection.SENT,
      },
      orderBy: {
        sendAt: 'desc',
      },
    });
    return PrismaCashCollectionMapper.toDomain(cashCollection);
  }

  public async update(input: CashCollection): Promise<CashCollection> {
    const cashCollectionEntity = PrismaCashCollectionMapper.toPrisma(input);
    const cashCollection = await this.prisma.cashCollection.update({
      where: {
        id: input.id,
      },
      data: cashCollectionEntity,
    });
    return PrismaCashCollectionMapper.toDomain(cashCollection);
  }

  public async findAllByPosIdsAndDate(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<CashCollection[]> {
    const cashCollections = await this.prisma.cashCollection.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: {
        posId: { in: posIds },
        cashCollectionDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      orderBy: {
        cashCollectionDate: 'asc',
      },
    });
    return cashCollections.map((item) =>
      PrismaCashCollectionMapper.toDomain(item),
    );
  }

  public async countAllByPosIdsAndDate(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return this.prisma.cashCollection.count({
      where: {
        posId: { in: posIds },
        cashCollectionDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    });
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.cashCollection.delete({ where: { id } });
  }
}
