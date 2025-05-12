import { Injectable } from '@nestjs/common';
import { DeviceDataRawHandlerResponse } from '@pos/device/device-data/device-data-raw/use-cases/dto/device-data-raw-handler-response';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { IDeviceEventTypeRepository } from '@pos/device/device-data/device-data/device-event/device-event-type/interface/device-event-type';
import { IDeviceEventRepository } from '@pos/device/device-data/device-data/device-event/device-event/interface/device-event';
import { DeviceEvent } from '@pos/device/device-data/device-data/device-event/device-event/domain/device-event';

@Injectable()
export class DeviceEventHandlerUseCase {
  constructor(
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly deviceEventTypeRepository: IDeviceEventTypeRepository,
    private readonly deviceEventRepository: IDeviceEventRepository,
  ) {}

  async execute(input: DeviceDataRawHandlerResponse): Promise<void> {
    let deviceId: number = null;
    let errNumId: number = null;
    let eventTypeId = input.data;

    const device = await this.findMethodsCarWashDeviceUseCase.getById(
      input.deviceId,
    );
    if (!device) {
      errNumId = 7;
    } else {
      deviceId = device.id;
    }

    const eventType =
      await this.deviceEventTypeRepository.findOneById(eventTypeId);
    if (!eventType) {
      errNumId = 6;
      eventTypeId = null;
    }

    const loadDate = new Date(Date.now());
    const deviceEvent = new DeviceEvent({
      carWashDeviceId: deviceId,
      carWashDeviceEventTypeId: eventTypeId,
      eventDate: input.begDate,
      loadDate: loadDate,
      localId: input.localId,
      errNumId: errNumId,
    });
    await this.deviceEventRepository.create(deviceEvent);
  }
}
