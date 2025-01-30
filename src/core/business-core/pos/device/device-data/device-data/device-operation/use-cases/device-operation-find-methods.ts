import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@pos/device/device-data/device-data/device-operation/interface/device-operation';
import { CurrencyType } from '@prisma/client';
import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';

@Injectable()
export class FindMethodsDeviceOperationUseCase {
  constructor(
    private readonly deviceOperationRepository: IDeviceOperationRepository,
  ) {}

  async getAllByCurTypeIdAndDateUseCase(
    currencyType: CurrencyType,
    carWashDeviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperation[]> {
    return await this.deviceOperationRepository.findAllByCurTypeAndDate(
      currencyType,
      carWashDeviceId,
      dateStart,
      dateEnd,
    );
  }

  async getAllByDeviceIdAndDateUseCase(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<DeviceOperation[]> {
    return await this.deviceOperationRepository.findAllByDeviceIdAndDate(
      deviceId,
      dateStart,
      dateEnd,
      skip,
      take,
    );
  }

  async getAllByOrgIdAndDateUseCase(
    organizationId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperation[]> {
    return await this.deviceOperationRepository.findAllByOrgIdAndDate(
      organizationId,
      dateStart,
      dateEnd,
    );
  }

  async getAllByPosIdAndDateUseCase(
    carWashPosId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperation[]> {
    return await this.deviceOperationRepository.findAllByPosIdAndDate(
      carWashPosId,
      dateStart,
      dateEnd,
    );
  }

  async getLastByDeviceIdUseCase(deviceId: number): Promise<DeviceOperation> {
    return await this.deviceOperationRepository.findLastOperByDeviceId(
      deviceId,
    );
  }

  async getLastByPosIdUseCase(posId: number): Promise<DeviceOperation> {
    return await this.deviceOperationRepository.findLastOperByPosId(posId);
  }
}
