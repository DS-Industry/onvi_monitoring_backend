import { Injectable } from '@nestjs/common';
import { IDeviceProgramTypeRepository } from '@device/device-program/device-program-type/interface/device-program-type';
import { DeviceProgramType } from '@device/device-program/device-program-type/domain/device-program-type';

@Injectable()
export class GetByIdDeviceProgramTypeUseCase {
  constructor(
    private readonly deviceProgramTypeRepository: IDeviceProgramTypeRepository,
  ) {}

  async execute(id: number): Promise<DeviceProgramType> {
    return await this.deviceProgramTypeRepository.findOneById(id);
  }
}
