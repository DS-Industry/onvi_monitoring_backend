import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@pos/device/device-data/device-data/device-operation/interface/device-operation';
import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';

@Injectable()
export class DeleteDeviceOperationUseCase {
  constructor(
    private readonly deviceOperationRepository: IDeviceOperationRepository,
  ) {}

  async execute(input: DeviceOperation): Promise<void> {
    await this.deviceOperationRepository.delete(input.id);
  }
}
