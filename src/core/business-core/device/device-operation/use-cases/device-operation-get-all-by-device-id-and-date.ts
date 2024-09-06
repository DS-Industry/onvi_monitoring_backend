import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@device/device-operation/interface/device-operation';
import { DeviceOperationGetAllByDeviceIdAndDateDto } from '@device/device-operation/use-cases/dto/device-operation-get-all-by-device-id-and-date.dto';
import { DeviceOperation } from '@device/device-operation/domain/device-operation';

@Injectable()
export class DeviceOperationGetAllByDeviceIdAndDateUseCase {
  constructor(
    private readonly deviceOperationRepository: IDeviceOperationRepository,
  ) {}

  async execute(
    input: DeviceOperationGetAllByDeviceIdAndDateDto,
  ): Promise<DeviceOperation[]> {
    return await this.deviceOperationRepository.findAllByDeviceIdAndDate(
      input.deviceId,
      input.dateStart,
      input.dateEnd,
    );
  }
}
