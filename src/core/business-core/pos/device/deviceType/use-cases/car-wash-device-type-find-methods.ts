import { Injectable } from '@nestjs/common';
import { CarWashDeviceType } from '@pos/device/deviceType/domen/deviceType';
import { ICarWashDeviceTypeRepository } from '@pos/device/deviceType/interfaces/deviceType';

@Injectable()
export class FindMethodsCarWashDeviceTypeUseCase {
  constructor(
    private readonly carWashDeviceTypeRepository: ICarWashDeviceTypeRepository,
  ) {}
  async getById(input: number): Promise<CarWashDeviceType> {
    return await this.carWashDeviceTypeRepository.findOneById(input);
  }

  async getByNameWithNull(input: string): Promise<CarWashDeviceType> {
    return await this.carWashDeviceTypeRepository.findOneByName(input);
  }

  async getByCodeWithNull(input: string): Promise<CarWashDeviceType> {
    return await this.carWashDeviceTypeRepository.findOneByCode(input);
  }

  async getAllByPosId(posId: number): Promise<CarWashDeviceType[]> {
    return await this.carWashDeviceTypeRepository.findAllByPosId(posId);
  }
}
