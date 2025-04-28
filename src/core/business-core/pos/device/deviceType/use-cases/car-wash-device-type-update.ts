import { Injectable } from '@nestjs/common';
import { ICarWashDeviceTypeRepository } from '@pos/device/deviceType/interfaces/deviceType';
import { CarWashDeviceType } from '@pos/device/deviceType/domen/deviceType';
import { CarWashDeviceTypeUpdateDto } from '@pos/device/deviceType/use-cases/dto/car-wash-device-type-update.dto';

@Injectable()
export class UpdateCarWashDeviceTypeUseCase {
  constructor(
    private readonly carWashDeviseTypeRepository: ICarWashDeviceTypeRepository,
  ) {}

  async execute(
    input: CarWashDeviceTypeUpdateDto,
    carWashDeviceType: CarWashDeviceType,
  ): Promise<CarWashDeviceType> {
    const { name, code } = input;

    carWashDeviceType.name = name ? name : carWashDeviceType.name;
    carWashDeviceType.code = code ? code : carWashDeviceType.code;

    return await this.carWashDeviseTypeRepository.update(carWashDeviceType);
  }
}
