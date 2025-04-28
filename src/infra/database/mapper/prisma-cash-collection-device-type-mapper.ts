import {
  CashCollectionDeviceType as PrismaCashCollectionDeviceType,
  Prisma,
} from '@prisma/client';
import { CashCollectionDeviceType } from '@finance/cashCollection/cashCollectionDeviceType/domain/cashCollectionDeviceType';
export type PrismaCashCollectionDeviceTypeWithDeviceType =
  Prisma.CashCollectionDeviceTypeGetPayload<{
    include: { carWashDeviceType: true };
  }>;
export class PrismaCashCollectionDeviceTypeMapper {
  static toDomain(
    entity:
      | PrismaCashCollectionDeviceType
      | PrismaCashCollectionDeviceTypeWithDeviceType,
  ): CashCollectionDeviceType {
    if (!entity) {
      return null;
    }
    const typeName =
      'carWashDeviceType' in entity && entity.carWashDeviceType
        ? entity.carWashDeviceType.name
        : undefined;
    return new CashCollectionDeviceType({
      id: entity.id,
      cashCollectionId: entity.cashCollectionId,
      carWashDeviceTypeId: entity.carWashDeviceTypeId,
      carWashDeviceTypeName: typeName,
      sumFact: entity.sumFact,
      sumCoin: entity.sumCoin,
      sumPaper: entity.sumPaper,
      shortage: entity.shortage,
      virtualSum: entity.virtualSum,
    });
  }

  static toPrisma(
    cashCollectionDeviceType: CashCollectionDeviceType,
  ): Prisma.CashCollectionDeviceTypeUncheckedCreateInput {
    return {
      id: cashCollectionDeviceType?.id,
      cashCollectionId: cashCollectionDeviceType?.cashCollectionId,
      carWashDeviceTypeId: cashCollectionDeviceType?.carWashDeviceTypeId,
      sumFact: cashCollectionDeviceType.sumFact,
      sumCoin: cashCollectionDeviceType.sumCoin,
      sumPaper: cashCollectionDeviceType.sumPaper,
      shortage: cashCollectionDeviceType.shortage,
      virtualSum: cashCollectionDeviceType.virtualSum,
    };
  }
}
