import {
  CarWashDeviceOperationsEvent as PrismaCarWashDeviceOper,
  Prisma,
} from '@prisma/client';
import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';
import { DeviceOperationFullDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-data-response.dto';
import {
  DeviceOperationMonitoringResponseDto
} from "@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-monitoring-response.dto";
export type PrismaCarWashDeviceOperWithCurrency =
  Prisma.CarWashDeviceOperationsEventGetPayload<{
    include: { currency: true };
  }>;
export type RawDeviceOperationsSummary = {
  posId: number;
  counter: bigint;
  cashSum: bigint;
  cashlessSum: bigint;
  virtualSum: bigint;
};

export type PrismaCarWashDeviceOperWithCurrencyAndPos =
  Prisma.CarWashDeviceOperationsEventGetPayload<{
    include: {
      currency: true;
      carWashDevice: {
        include: {
          carWasPos: {
            include: {
              pos: true;
            };
          };
        };
      };
    };
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

  static toDomainWithPosData(
    entity: PrismaCarWashDeviceOper | PrismaCarWashDeviceOperWithCurrencyAndPos,
  ): DeviceOperationFullDataResponseDto {
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
    let posId: number | undefined;
    let posName: string | undefined;

    if ('carWashDevice' in entity && entity.carWashDevice?.carWasPos?.pos) {
      posId = entity.carWashDevice.carWasPos.pos.id;
      posName = entity.carWashDevice.carWasPos.pos.name;
    }

    return {
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
      posId: posId,
      posName: posName,
    };
  }

  static toMonitoringResponseDto(
    item: RawDeviceOperationsSummary,
  ): DeviceOperationMonitoringResponseDto {
    return {
      posId: item.posId,
      counter: Number(item.counter),
      cashSum: Number(item.cashSum),
      virtualSum: Number(item.cashlessSum),
      yandexSum: Number(item.virtualSum),
    };
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
