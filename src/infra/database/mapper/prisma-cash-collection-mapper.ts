import { CashCollection as PrismaCashCollection, Prisma } from '@prisma/client';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';
export class PrismaCashCollectionMapper {
  static toDomain(entity: PrismaCashCollection): CashCollection {
    if (!entity) {
      return null;
    }
    return new CashCollection({
      id: entity.id,
      cashCollectionDate: entity.cashCollectionDate,
      sendDate: entity.sendAt,
      status: entity.status,
      sumFact: entity.sumFact,
      posId: entity.posId,
      shortage: entity.shortage,
      sumCard: entity.sumCard,
      countCar: entity.countCar,
      countCarCard: entity.countCarCard,
      averageCheck: entity.averageCheck,
      virtualSum: entity.virtualSum,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    });
  }

  static toPrisma(
    cashCollection: CashCollection,
  ): Prisma.CashCollectionUncheckedCreateInput {
    return {
      id: cashCollection?.id,
      cashCollectionDate: cashCollection.cashCollectionDate,
      sendAt: cashCollection.sendDate,
      status: cashCollection.status,
      sumFact: cashCollection.sumFact,
      posId: cashCollection?.posId,
      shortage: cashCollection.shortage,
      sumCard: cashCollection.sumCard,
      countCar: cashCollection.countCar,
      countCarCard: cashCollection.countCarCard,
      averageCheck: cashCollection.averageCheck,
      virtualSum: cashCollection.virtualSum,
      createdAt: cashCollection.createdAt,
      updatedAt: cashCollection.updatedAt,
      createdById: cashCollection.createdById,
      updatedById: cashCollection.updatedById,
    };
  }
}
