import { Injectable } from '@nestjs/common';
import { IDeviceOperationCardRepository } from '@pos/device/device-data/device-data/device-operation-card/interface/device-operation-card';
import { DeviceOperationCard } from '@pos/device/device-data/device-data/device-operation-card/domain/device-operation-card';

@Injectable()
export class FindMethodsDeviceOperationCardUseCase {
  constructor(
    private readonly deviceOperationCardRepository: IDeviceOperationCardRepository,
  ) {}

  async getAllByDeviceIdAndDateUseCase(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<DeviceOperationCard[]> {
    return await this.deviceOperationCardRepository.findAllByDeviceIdAndDate(
      deviceId,
      dateStart,
      dateEnd,
      skip,
      take,
    );
  }
}
