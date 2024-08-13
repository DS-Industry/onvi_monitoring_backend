import { Injectable } from '@nestjs/common';
import { IDeviceEventRepository } from '@device/device-event/device-event/interface/device-event';
import { DeviceEventCreateDto } from '@device/device-event/device-event/use-case/dto/device-event-create.dto';
import { DeviceEvent } from '@device/device-event/device-event/domain/device-event';

@Injectable()
export class CreateDeviceEventUseCase {
  constructor(private readonly deviceEventRepository: IDeviceEventRepository) {}

  async execute(input: DeviceEventCreateDto): Promise<void> {
    const deviceEvent = new DeviceEvent({
      carWashDeviceId: input?.carWashDeviceId,
      carWashDeviceEventTypeId: input?.carWashDeviceEventTypeId,
      eventDate: input.eventDate,
      loadDate: input.loadDate,
      localId: input.localId,
      errNumId: input?.errNumId,
    });

    await this.deviceEventRepository.create(deviceEvent);
  }
}
