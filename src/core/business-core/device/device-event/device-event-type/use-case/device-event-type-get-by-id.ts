import { Injectable } from '@nestjs/common';
import { IDeviceEventTypeRepository } from '@device/device-event/device-event-type/interface/device-event-type';
import { DeviceEventType } from '@device/device-event/device-event-type/domain/device-event-type';

@Injectable()
export class GetByIdDeviceEventTypeUseCase {
  constructor(
    private readonly deviceEventTypeRepository: IDeviceEventTypeRepository,
  ) {}

  async execute(id: number): Promise<DeviceEventType> {
    return await this.deviceEventTypeRepository.findOneById(id);
  }
}
