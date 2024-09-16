import { Injectable } from '@nestjs/common';
import { DeviceServiceCreateDto } from '@device/device-service/use-case/dto/device-service-create.dto';
import { DeviceService } from '@device/device-service/domain/device-service';
import { IDeviceServiceRepository } from '@device/device-service/interface/device-service';

@Injectable()
export class CreateDeviceServiceUseCase {
  constructor(
    private readonly deviceServiceRepository: IDeviceServiceRepository,
  ) {}

  async execute(input: DeviceServiceCreateDto): Promise<void> {
    const deviceService = new DeviceService({
      carWashDeviceId: input?.carWashDeviceId,
      carWashDeviceProgramsTypeId: input.carWashDeviceProgramsTypeId,
      beginDate: input.beginDate,
      endDate: input.endDate,
      loadDate: input.loadDate,
      localId: input.localId,
      counter: input.counter,
      errNumId: input?.errNumId,
    });

    await this.deviceServiceRepository.create(deviceService);
  }
}
