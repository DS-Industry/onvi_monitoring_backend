import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import { DeviceProgramFullDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-full-data-response.dto';
import { DeviceProgramMonitoringResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-monitoring-response.dto';
import { DeviceProgramLastDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-last-data-response.dto';
import { DeviceProgramCleanDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-clean-data-response.dto';

export abstract class IDeviceProgramRepository {
  abstract create(input: DeviceProgram): Promise<DeviceProgram>;
  abstract findOneById(id: number): Promise<DeviceProgram>;
  abstract findAllByFilter(
    ability?: any,
    organizationId?: number,
    posIds?: number[],
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    programCode?: string,
    isPaid?: number,
    skip?: number,
    take?: number,
  ): Promise<DeviceProgramFullDataResponseDto[]>;
  abstract findDataByMonitoring(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramMonitoringResponseDto[]>;
  abstract findDataByMonitoringDetail(
    deviceIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramMonitoringResponseDto[]>;
  abstract findDataByMonitoringDetailPortal(
    deviceIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramMonitoringResponseDto[]>;
  abstract findDataByClean(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramCleanDataResponseDto[]>;
  abstract findDataLastProgByPosIds(
    posIds: number[],
  ): Promise<DeviceProgramLastDataResponseDto[]>;
  abstract findDataLastProgByDeviceIds(
    deviceIds: number[],
  ): Promise<DeviceProgramLastDataResponseDto[]>;
  abstract findProgramForCheckCar(
    carWashDeviceId: number,
    dateStart: Date,
    carWashDeviceProgramsTypeId: number,
  ): Promise<Date>;
  abstract countAllByDeviceIdAndDateProgram(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number>;
}
