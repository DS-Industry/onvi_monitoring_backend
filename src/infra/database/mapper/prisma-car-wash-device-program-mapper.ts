import {
  CarWashDeviceProgramsEvent as PrismaCarWashDeviceProgram,
  Prisma,
} from '@prisma/client';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import { DeviceProgramFullDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-full-data-response.dto';
import { DeviceProgramMonitoringResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-monitoring-response.dto';
export type PrismaCarWashDeviceProgramWithType =
  Prisma.CarWashDeviceProgramsEventGetPayload<{
    include: { carWashDeviceProgramsType: true };
  }>;
export type PrismaCarWashDeviceProgramWithPos =
  Prisma.CarWashDeviceProgramsEventGetPayload<{
    include: {
      carWashDeviceProgramsType: true;
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
export type RawDeviceProgramsSummary = {
  ownerId: number;
  programName: string;
  counter: bigint;
  totalTime: bigint;
  averageTime: bigint;
  totalProfit?: bigint;
  averageProfit?: bigint;
};
export class PrismaCarWashDeviceProgramMapper {
  static toDomain(
    entity: PrismaCarWashDeviceProgram | PrismaCarWashDeviceProgramWithType,
  ): DeviceProgram {
    if (!entity) {
      return null;
    }
    const programName =
      'carWashDeviceProgramsType' in entity && entity.carWashDeviceProgramsType
        ? entity.carWashDeviceProgramsType.name
        : undefined;

    return new DeviceProgram({
      id: entity.id,
      carWashDeviceId: entity.carWashDeviceId,
      carWashDeviceProgramsTypeId: entity.carWashDeviceProgramsTypeId,
      beginDate: entity.beginDate,
      loadDate: entity.loadDate,
      endDate: entity.endDate,
      confirm: entity.confirm,
      isPaid: entity.isPaid,
      localId: entity.localId,
      isAgregate: entity.isAgregate,
      minute: entity.minute,
      errNumId: entity.errNumId,
      programName: programName,
    });
  }

  static toDomainWithPos(
    entity: PrismaCarWashDeviceProgram | PrismaCarWashDeviceProgramWithPos,
  ): DeviceProgramFullDataResponseDto {
    if (!entity) {
      return null;
    }
    const programName =
      'carWashDeviceProgramsType' in entity && entity.carWashDeviceProgramsType
        ? entity.carWashDeviceProgramsType.name
        : undefined;

    const programCode =
      'carWashDeviceProgramsType' in entity && entity.carWashDeviceProgramsType
        ? entity.carWashDeviceProgramsType.code
        : undefined;

    let posId: number | undefined;
    if ('carWashDevice' in entity && entity.carWashDevice?.carWasPos?.pos) {
      posId = entity.carWashDevice.carWasPos.pos.id;
    }

    return {
      id: entity.id,
      carWashDeviceId: entity.carWashDeviceId,
      carWashDeviceProgramsTypeId: entity.carWashDeviceProgramsTypeId,
      beginDate: entity.beginDate,
      loadDate: entity.loadDate,
      endDate: entity.endDate,
      confirm: entity.confirm,
      isPaid: entity.isPaid,
      localId: entity.localId,
      isAgregate: entity.isAgregate,
      minute: entity.minute,
      errNumId: entity.errNumId,
      programName: programName,
      programCode: programCode,
      posId: posId,
    };
  }

  static toMonitoringRersponseDto(
    item: RawDeviceProgramsSummary,
  ): DeviceProgramMonitoringResponseDto {
    return {
      ownerId: item.ownerId,
      programName: item.programName,
      counter: Number(item.counter),
      totalTime: Number(item.totalTime),
      averageTime: Number(item.averageTime),
      totalProfit:
        typeof item?.totalProfit === 'bigint'
          ? Number(item.totalProfit)
          : Number(item?.totalProfit || 0),
      averageProfit:
        typeof item?.averageProfit === 'bigint'
          ? Number(item.averageProfit)
          : Number(item?.averageProfit || 0),
    };
  }

  static toPrisma(
    deviceProgram: DeviceProgram,
  ): Prisma.CarWashDeviceProgramsEventUncheckedCreateInput {
    return {
      id: deviceProgram?.id,
      carWashDeviceId: deviceProgram?.carWashDeviceId,
      carWashDeviceProgramsTypeId: deviceProgram?.carWashDeviceProgramsTypeId,
      beginDate: deviceProgram.beginDate,
      loadDate: deviceProgram.loadDate,
      endDate: deviceProgram.endDate,
      confirm: deviceProgram.confirm,
      isPaid: deviceProgram.isPaid,
      localId: deviceProgram.localId,
      isAgregate: deviceProgram?.isAgregate,
      minute: deviceProgram?.minute,
      errNumId: deviceProgram?.errNumId,
    };
  }
}
