import { Injectable } from '@nestjs/common';
import { IDeviceProgramTypeRepository } from '@pos/device/device-data/device-data/device-program/device-program-type/interface/device-program-type';
import { DeviceProgramType } from '@pos/device/device-data/device-data/device-program/device-program-type/domain/device-program-type';

@Injectable()
export class FindMethodsDeviceProgramTypeUseCase {
  constructor(
    private readonly deviceProgramTypeRepository: IDeviceProgramTypeRepository,
  ) {}

  async getById(input: number): Promise<DeviceProgramType> {
    return await this.deviceProgramTypeRepository.findOneById(input);
  }

  async getAll(): Promise<DeviceProgramType[]> {
    return await this.deviceProgramTypeRepository.findAll();
  }

  async getAllByPosId(posId: number): Promise<DeviceProgramType[]> {
    return await this.deviceProgramTypeRepository.findAllByPosId(posId);
  }
}
