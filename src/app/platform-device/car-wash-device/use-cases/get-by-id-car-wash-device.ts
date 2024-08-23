import { Injectable } from '@nestjs/common';
import { ICarWashDeviceRepository } from '../interfaces/car-wash-device';
import { CarWashDevice } from '../domain/car-wash-device';

@Injectable()
export class GetByIdCarWashDeviceUseCase {
  constructor(
    private readonly carWashDeviceRepository: ICarWashDeviceRepository,
  ) {}

  async execute(id: number): Promise<CarWashDevice> {
    return this.carWashDeviceRepository.findOneById(id);
  }
}
