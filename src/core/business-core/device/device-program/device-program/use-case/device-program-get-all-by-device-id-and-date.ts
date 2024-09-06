import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@device/device-program/device-program/interface/device-program';
import { DeviceProgram } from '@device/device-program/device-program/domain/device-program';
import {
  DeviceOperationGetAllByDeviceIdAndDateDto
} from "@device/device-operation/use-cases/dto/device-operation-get-all-by-device-id-and-date.dto";

@Injectable()
export class GetAllByDeviceIdAndDateDeviceProgramUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
  ) {}

  async execute(
    input: DeviceOperationGetAllByDeviceIdAndDateDto,
  ): Promise<DeviceProgram[]> {
    return await this.deviceProgramRepository.findAllByDeviceIdAndDate(
      input.deviceId,
      input.dateStart,
      input.dateEnd,
    );
  }
}
