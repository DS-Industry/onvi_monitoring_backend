import { Injectable } from '@nestjs/common';
import { ICarWashDeviceTypeRepository } from '@device/deviceType/interfaces/deviceType';
import { CarWashDeviceType } from '@device/deviceType/domen/deviceType';

@Injectable()
export class CreateCarWashDeviceTypeUseCase {
  constructor(
    private readonly carWashDeviceTypeRepository: ICarWashDeviceTypeRepository,
  ) {}

  async execute(name: string, code: string): Promise<CarWashDeviceType> {
    const deviceCheckName =
      await this.carWashDeviceTypeRepository.findOneByName(name);
    const deviceCheckCode =
      await this.carWashDeviceTypeRepository.findOneByCode(code);
    if (deviceCheckName) {
      throw new Error('name device exists');
    }
    if (deviceCheckCode) {
      throw new Error('code device exists');
    }
    const carWashDeviceTypeData = new CarWashDeviceType({
      name: name,
      code: code,
    });
    return await this.carWashDeviceTypeRepository.create(carWashDeviceTypeData);
  }
}
