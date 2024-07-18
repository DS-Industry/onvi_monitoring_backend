import { Injectable } from '@nestjs/common';
import { CarWashDeviceType } from '@device/deviceType/domen/deviceType';
import { ICarWashDeviceTypeRepository } from '@device/deviceType/interfaces/deviceType';

@Injectable()
export class GetByIdCarWashDeviceTypeUseCase {
  constructor(
    private readonly carWashDeviceTypeRepository: ICarWashDeviceTypeRepository,
  ) {}

  async execute(input: number): Promise<CarWashDeviceType> {
    const carWashDeviceType =
      await this.carWashDeviceTypeRepository.findOneById(input);
    if (!carWashDeviceType) {
      throw new Error('carWashDeviceType not exists');
    }
    return carWashDeviceType;
  }
}
