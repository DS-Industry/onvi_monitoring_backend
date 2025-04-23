import { Injectable } from '@nestjs/common';
import { IDeviceProgramTypeRepository } from '@pos/device/device-data/device-data/device-program/device-program-type/interface/device-program-type';

@Injectable()
export class ConnectionPosDeviceProgramTypeUseCase {
  constructor(
    private readonly deviceProgramTypeRepository: IDeviceProgramTypeRepository,
  ) {}

  async execute(posId: number, programTypeIds: number[]): Promise<any> {
    await this.deviceProgramTypeRepository.connectionPos(programTypeIds, posId);
    return { status: 'Success' };
  }
}
