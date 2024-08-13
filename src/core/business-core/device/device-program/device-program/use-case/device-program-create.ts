import { Injectable } from '@nestjs/common';
import { DeviceProgramCreateDto } from '@device/device-program/device-program/use-case/dto/device-program-create.dto';
import { IDeviceProgramRepository } from '@device/device-program/device-program/interface/device-program';
import { DeviceProgram } from '@device/device-program/device-program/domain/device-program';

@Injectable()
export class CreateDeviceProgramUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
  ) {}

  async execute(input: DeviceProgramCreateDto): Promise<void> {
    const deviceProgramData = new DeviceProgram({
      carWashDeviceId: input?.carWashDeviceId,
      carWashDeviceProgramsTypeId: input?.carWashDeviceProgramsTypeId,
      beginDate: input.beginDate,
      loadDate: input.loadDate,
      endDate: input.endDate,
      confirm: input.confirm,
      isPaid: input.isPaid,
      localId: input.localId,
      isAgregate: input?.isAgregate,
      minute: input?.minute,
      errNumId: input?.errNumId,
    });

    await this.deviceProgramRepository.create(deviceProgramData);
  }
}
