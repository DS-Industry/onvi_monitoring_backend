import { Injectable } from '@nestjs/common';
import { IDeviceEventRepository } from '@pos/device/device-data/device-data/device-event/device-event/interface/device-event';
import { DeviceEvent } from '@pos/device/device-data/device-data/device-event/device-event/domain/device-event';

@Injectable()
export class CreateDeviceEventUseCase {
  constructor(private readonly deviceEventRepository: IDeviceEventRepository) {}

  async execute(
    carWashDeviceId: number,
    eventTypeId: number,
    eventDate: Date,
  ): Promise<DeviceEvent> {
    const deviceEventDate = new DeviceEvent({
      carWashDeviceId: carWashDeviceId,
      carWashDeviceEventTypeId: eventTypeId,
      eventDate: eventDate,
      loadDate: new Date(Date.now()),
      localId: 0,
    });
    return await this.deviceEventRepository.create(deviceEventDate);
  }
}
