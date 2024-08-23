import { Injectable } from '@nestjs/common';
import { IDeviceObjectRepository } from '../interfaces/device-object';
import { DeviceObject } from '../domain/device-object';

@Injectable()
export class GetDeviceObjectByIdUseCase {
  constructor(
    private readonly deviceObjectRepository: IDeviceObjectRepository,
  ) {}

  async execute(id: number): Promise<DeviceObject | null> {
    return this.deviceObjectRepository.findById(id);
  }
}
