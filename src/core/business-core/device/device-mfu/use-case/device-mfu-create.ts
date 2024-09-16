import { Injectable } from '@nestjs/common';
import { IDeviceMfuRepository } from '@device/device-mfu/interface/device-mfu';
import { DeviceMfuCreateDto } from '@device/device-mfu/use-case/dto/device-mfu-create.dto';
import { DeviceMfy } from '@device/device-mfu/domain/device-mfu';

@Injectable()
export class CreateDeviceMfuUseCase {
  constructor(private readonly deviceMfuRepository: IDeviceMfuRepository) {}

  async execute(input: DeviceMfuCreateDto): Promise<void> {
    const deviceMfu = new DeviceMfy({
      carWashDeviceId: input?.carWashDeviceId,
      cashIn: input.cashIn,
      coinOut: input.coinOut,
      beginDate: input.beginDate,
      endDate: input.endDate,
      loadDate: input.loadDate,
      localId: input.localId,
      errNumId: input?.errNumId,
    });

    await this.deviceMfuRepository.create(deviceMfu);
  }
}
