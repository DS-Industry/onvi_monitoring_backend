import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import {
  DeviceProgramFullDataResponseDto
} from "@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-full-data-response.dto";

export abstract class IDeviceProgramRepository {
  abstract create(input: DeviceProgram): Promise<DeviceProgram>;
  abstract findOneById(id: number): Promise<DeviceProgram>;
  abstract findAllByFilter(
    ability?: any,
    organizationId?: number,
    posId?: number,
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    programCode?: string,
    isPaid?: number,
    skip?: number,
    take?: number,
  ): Promise<DeviceProgramFullDataResponseDto[]>;
  abstract findLastProgramByPosId(carWashPosId: number): Promise<DeviceProgram>;
  abstract findLastProgramByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceProgram>;
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
