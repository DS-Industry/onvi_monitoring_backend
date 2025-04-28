import {
  CarWashDeviceOperationsCardEvent as PrismaCarWashDeviceOperCard,
  Prisma,
} from '@prisma/client';
import { DeviceOperationCard } from '@pos/device/device-data/device-data/device-operation-card/domain/device-operation-card';

export class PrismaCarWashDeviceOperCardMapper {
  static toDomain(entity: PrismaCarWashDeviceOperCard): DeviceOperationCard {
    if (!entity) {
      return null;
    }
    return new DeviceOperationCard({
      id: entity.id,
      carWashDeviceId: entity.carWashDeviceId,
      operDate: entity.operDate,
      loadDate: entity.loadDate,
      cardNumber: entity.cardNumber,
      discount: entity.discount,
      sum: entity.sum,
      localId: entity.localId,
      operId: entity.operId,
      discountSum: entity.discountSum,
      totalSum: entity.totalSum,
      isBonus: entity.isBonus,
      currency: entity.currency,
      cashback: entity.cashback,
      cashbackPercent: entity.cashbackPercent,
      errNumId: entity.errNumId,
    });
  }

  static toPrisma(
    deviceOperationCard: DeviceOperationCard,
  ): Prisma.CarWashDeviceOperationsCardEventUncheckedCreateInput {
    return {
      id: deviceOperationCard?.id,
      carWashDeviceId: deviceOperationCard.carWashDeviceId,
      operDate: deviceOperationCard.operDate,
      loadDate: deviceOperationCard.loadDate,
      cardNumber: deviceOperationCard.cardNumber,
      discount: deviceOperationCard.discount,
      sum: deviceOperationCard.sum,
      localId: deviceOperationCard.localId,
      operId: deviceOperationCard.operId,
      discountSum: deviceOperationCard.discountSum,
      totalSum: deviceOperationCard?.totalSum,
      isBonus: deviceOperationCard?.isBonus,
      currency: deviceOperationCard.currency,
      cashback: deviceOperationCard?.cashback,
      cashbackPercent: deviceOperationCard?.cashbackPercent,
      errNumId: deviceOperationCard?.errNumId,
    };
  }
}
