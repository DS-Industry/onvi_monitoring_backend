import {
  CashCollectionDevice as PrismaCashCollectionDevice,
  Prisma,
} from '@prisma/client';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
export class PrismaCashCollectionDeviceMapper {
  static toDomain(entity: PrismaCashCollectionDevice): CashCollectionDevice {
    if (!entity) {
      return null;
    }
    return new CashCollectionDevice({
      id: entity.id,
      cashCollectionId: entity.cashCollectionId,
      carWashDeviceId: entity.carWashDeviceId,
      oldTookMoneyTime: entity.oldTookMoneyTime,
      tookMoneyTime: entity.tookMoneyTime,
      sum: entity.sum,
      sumCoin: entity.sumCoin,
      sumPaper: entity.sumPaper,
      sumCard: entity.sumCard,
      carCount: entity.carCount,
      virtualSum: entity.virtualSum,
    });
  }

  static toPrisma(
    cashCollectionDevice: CashCollectionDevice,
  ): Prisma.CashCollectionDeviceUncheckedCreateInput {
    return {
      id: cashCollectionDevice?.id,
      cashCollectionId: cashCollectionDevice?.cashCollectionId,
      carWashDeviceId: cashCollectionDevice?.carWashDeviceId,
      oldTookMoneyTime: cashCollectionDevice.oldTookMoneyTime,
      tookMoneyTime: cashCollectionDevice.tookMoneyTime,
      sum: cashCollectionDevice.sum,
      sumCoin: cashCollectionDevice.sumCoin,
      sumPaper: cashCollectionDevice.sumPaper,
      sumCard: cashCollectionDevice.sumCard,
      carCount: cashCollectionDevice.carCount,
      virtualSum: cashCollectionDevice.virtualSum,
    };
  }
}
