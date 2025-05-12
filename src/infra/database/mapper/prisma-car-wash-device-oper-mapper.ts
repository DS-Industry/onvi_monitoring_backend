import {
  CarWashDeviceOperationsEvent as PrismaCarWashDeviceOper,
  Prisma,
} from '@prisma/client';
import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';
export type PrismaCarWashDeviceOperWithCurrency =
  Prisma.CarWashDeviceOperationsEventGetPayload<{
    include: { currency: true };
  }>;
export class PrismaCarWashDeviceOperMapper {
  static toDomain(
    entity: PrismaCarWashDeviceOper | PrismaCarWashDeviceOperWithCurrency,
  ): DeviceOperation {
    if (!entity) {
      return null;
    }
    const currencyType =
      'currency' in entity && entity.currency
        ? entity.currency.currencyType
        : undefined;

    const currencyName =
      'currency' in entity && entity.currency
        ? entity.currency.name
        : undefined;

    const currencyView =
      'currency' in entity && entity.currency
        ? entity.currency.currencyView
        : undefined;

    return new DeviceOperation({
      id: entity.id,
      carWashDeviceId: entity.carWashDeviceId,
      operDate: entity.operDate,
      loadDate: entity.loadDate,
      counter: entity.counter.toString(),
      operSum: entity.operSum,
      confirm: entity.confirm,
      isAgregate: entity.isAgregate,
      localId: entity.localId,
      currencyId: entity.currencyId,
      isBoxOffice: entity.isBoxOffice,
      errNumId: entity.errNumId,
      currencyType: currencyType,
      currencyName: currencyName,
      currencyView: currencyView,
    });
  }

  static toPrisma(
    deviceOperation: DeviceOperation,
  ): Prisma.CarWashDeviceOperationsEventUncheckedCreateInput {
    return {
      id: deviceOperation?.id,
      carWashDeviceId: deviceOperation.carWashDeviceId,
      operDate: deviceOperation.operDate,
      loadDate: deviceOperation.loadDate,
      counter: BigInt(deviceOperation.counter),
      operSum: deviceOperation.operSum,
      confirm: deviceOperation.confirm,
      isAgregate: deviceOperation.isAgregate,
      localId: deviceOperation.localId,
      currencyId: deviceOperation.currencyId,
      isBoxOffice: deviceOperation.isBoxOffice,
      errNumId: deviceOperation?.errNumId,
    };
  }
}
