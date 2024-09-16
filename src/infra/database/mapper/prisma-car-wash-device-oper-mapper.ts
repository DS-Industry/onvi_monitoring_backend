import {
  CarWashDeviceOperationsEvent as PrismaCarWashDeviceOper,
  Prisma,
} from '@prisma/client';
import { DeviceOperation } from '@device/device-operation/domain/device-operation';
export class PrismaCarWashDeviceOperMapper {
  static toDomain(entity: PrismaCarWashDeviceOper): DeviceOperation {
    if (!entity) {
      return null;
    }
    return new DeviceOperation({
      id: entity.id,
      carWashDeviceId: entity.carWashDeviceId,
      operDate: entity.operDate,
      loadDate: entity.loadDate,
      counter: entity.counter,
      operSum: entity.operSum,
      confirm: entity.confirm,
      isAgregate: entity.isAgregate,
      localId: entity.localId,
      currencyId: entity.currencyId,
      isBoxOffice: entity.isBoxOffice,
      errNumId: entity.errNumId,
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
      counter: deviceOperation.counter,
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
