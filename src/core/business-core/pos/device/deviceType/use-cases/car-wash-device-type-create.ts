import { Injectable } from '@nestjs/common';
import { ICarWashDeviceTypeRepository } from '@pos/device/deviceType/interfaces/deviceType';
import { CarWashDeviceType } from '@pos/device/deviceType/domen/deviceType';

@Injectable()
export class CreateCarWashDeviceTypeUseCase {
  constructor(
    private readonly carWashDeviceTypeRepository: ICarWashDeviceTypeRepository,
  ) {}

  async execute(name: string, code: string): Promise<CarWashDeviceType> {
    const carWashDeviceTypeData = new CarWashDeviceType({
      name: name,
      code: code,
    });
    return await this.carWashDeviceTypeRepository.create(carWashDeviceTypeData);
  }
}
