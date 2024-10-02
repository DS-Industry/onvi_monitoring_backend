import { Injectable } from '@nestjs/common';
import { ICarWashDeviceRepository } from '@pos/device/device/interfaces/device';
import { CarWashDevice } from '@pos/device/device/domain/device';

@Injectable()
export class FindMethodsCarWashDeviceUseCase {
  constructor(
    private readonly carWashDeviceRepository: ICarWashDeviceRepository,
  ) {}

  async getById(input: number): Promise<CarWashDevice> {
    return await this.carWashDeviceRepository.findOneById(input);
  }

  async getAllByPos(input: number): Promise<CarWashDevice[]> {
    return await this.carWashDeviceRepository.findAllByCWId(input);
  }

  async getByNameAndCWId(posId: number, name: string): Promise<CarWashDevice> {
    return await this.carWashDeviceRepository.findOneByNameAndCWId(posId, name);
  }
}
