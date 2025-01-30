import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';

export abstract class IDeviceProgramRepository {
  abstract create(input: DeviceProgram): Promise<DeviceProgram>;
  abstract findOneById(id: number): Promise<DeviceProgram>;
  abstract findAllByDeviceId(carWashDeviceId: number): Promise<DeviceProgram[]>;
  abstract findAllByOrgIdAndDate(
    organizationId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]>;
  abstract findAllByPosIdAndDate(
    carWashPosId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]>;
  abstract findAllByPosIdAndProgramCodeAndDate(
    carWashPosId: number,
    code: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]>;
  abstract findAllByDeviceIdAndDate(
    carWashDeviceId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<DeviceProgram[]>;
  abstract findLastProgramByPosId(carWashPosId: number): Promise<DeviceProgram>;
  abstract findLastProgramByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceProgram>;
  abstract findProgramForCheckCar(
    carWashDeviceId: number,
    dateStart: Date,
    carWashDeviceProgramsTypeId: number,
  ): Promise<Date>;
}
