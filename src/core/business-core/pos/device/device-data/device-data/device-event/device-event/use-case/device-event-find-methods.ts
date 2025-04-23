import { Injectable } from '@nestjs/common';
import { IDeviceEventRepository } from '@pos/device/device-data/device-data/device-event/device-event/interface/device-event';
import { DeviceEvent } from '@pos/device/device-data/device-data/device-event/device-event/domain/device-event';

@Injectable()
export class FindMethodsDeviceEventUseCase {
  constructor(private readonly deviceEventRepository: IDeviceEventRepository) {}

  async getLastEventByDeviceIdAndTypeId(
    carWashDeviceId: number,
    eventTypeId: number,
  ): Promise<DeviceEvent> {
    return await this.deviceEventRepository.findLastEventByDeviceIdAndTypeId(
      carWashDeviceId,
      eventTypeId,
    );
  }
}
