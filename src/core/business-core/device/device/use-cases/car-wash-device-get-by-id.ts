import { Injectable } from '@nestjs/common';
import { ICarWashDeviceRepository } from '@device/device/interfaces/device';
import { CarWashDevice } from '@device/device/domain/device';

@Injectable()
export class GetByIdCarWashDeviceUseCase {
  constructor(
    private readonly carWashDeviceRepository: ICarWashDeviceRepository,
  ) {}

  async execute(input: number): Promise<CarWashDevice> {
    return await this.carWashDeviceRepository.findOneById(input);
  }
}
