import { Injectable } from '@nestjs/common';
import { ICarWashDeviceTypeRepository } from '@device/deviceType/interfaces/deviceType';
import { CarWashDeviceType } from '@device/deviceType/domen/deviceType';
import { CarWashDeviceTypeUpdateDto } from '@device/deviceType/use-cases/dto/car-wash-device-type-update.dto';

@Injectable()
export class UpdateCarWashDeviceTypeUseCase {
  constructor(
    private readonly carWashDeviseTypeRepository: ICarWashDeviceTypeRepository,
  ) {}

  async execute(input: CarWashDeviceTypeUpdateDto): Promise<CarWashDeviceType> {
    const carWashDeviceType =
      await this.carWashDeviseTypeRepository.findOneById(input.id);
    if (!carWashDeviceType) {
      throw new Error('device type not exists');
    }
    const { name, code } = input;

    carWashDeviceType.name = name ? name : carWashDeviceType.name;
    carWashDeviceType.code = code ? code : carWashDeviceType.code;

    return await this.carWashDeviseTypeRepository.update(carWashDeviceType);
  }
}
