import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@device/device-operation/interface/device-operation';
import { DeviceOperation } from '@device/device-operation/domain/device-operation';

@Injectable()
export class DeviceOperationGetLastOperByPosIdUseCase {
  constructor(
    private readonly deviceOperationRepository: IDeviceOperationRepository,
  ) {}

  async execute(posId: number): Promise<DeviceOperation> {
    return await this.deviceOperationRepository.findLastOperByPosId(posId);
  }
}
