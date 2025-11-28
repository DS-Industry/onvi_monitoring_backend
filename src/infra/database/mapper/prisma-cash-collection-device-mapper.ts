import {
  CashCollectionDevice as PrismaCashCollectionDevice,
  Prisma,
} from '@prisma/client';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { CashCollectionDeviceCalculateResponseDto } from '@finance/cashCollection/cashCollectionDevice/use-cases/dto/cashCollectionDevice-calculate-response.dto';
export type RawDeviceOperationsSummary = {
  deviceId: number;
  sumCoin: bigint;
  sumPaper: bigint;
  virtualSum: bigint;
  sumCard: bigint;
  carCount: bigint;
  oldTookMoneyTime: Date;
  tookMoneyTime: Date;
};
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

  static toCalculateResponseDto(
    item: RawDeviceOperationsSummary,
  ): CashCollectionDeviceCalculateResponseDto {
    return {
      deviceId: item.deviceId,
      sumCoin: Number(item.sumCoin),
      sumPaper: Number(item.sumPaper),
      virtualSum: Number(item.virtualSum),
      sumCard: Number(item.sumCard),
      carCount: Number(item.carCount),
      oldTookMoneyTime: item.oldTookMoneyTime,
      tookMoneyTime: item.tookMoneyTime,
    };
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
