import { Injectable } from '@nestjs/common';
import { GetByIdCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-by-id';
import { DeviceDataRawHandlerResponse } from '@device/device-data-raw/use-cases/dto/device-data-raw-handler-response';
import { GetByIdDeviceEventTypeUseCase } from '@device/device-event/device-event-type/use-case/device-event-type-get-by-id';
import { CreateDeviceEventUseCase } from '@device/device-event/device-event/use-case/device-event-create';

@Injectable()
export class DeviceEventHandlerUseCase {
  constructor(
    private readonly getByIdCarWashDeviceUseCase: GetByIdCarWashDeviceUseCase,
    private readonly getByIdDeviceEventTypeUseCase: GetByIdDeviceEventTypeUseCase,
    private readonly createDeviceEventUseCase: CreateDeviceEventUseCase,
  ) {}

  async execute(input: DeviceDataRawHandlerResponse): Promise<void> {
    let deviceId: number = null;
    let errNumId: number = null;
    let eventTypeId = input.data;

    const device = await this.getByIdCarWashDeviceUseCase.execute(
      input.deviceId,
    );
    if (!device) {
      errNumId = 7;
    } else {
      deviceId = device.id;
    }

    const eventType =
      await this.getByIdDeviceEventTypeUseCase.execute(eventTypeId);
    if (!eventType) {
      errNumId = 6;
      eventTypeId = null;
    }

    const loadDate = new Date(Date.now());
    await this.createDeviceEventUseCase.execute({
      carWashDeviceId: deviceId,
      carWashDeviceEventTypeId: eventTypeId,
      eventDate: input.begDate,
      loadDate: loadDate,
      localId: input.localId,
      errNumId: errNumId,
    });
  }
}