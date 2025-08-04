import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@pos/device/device-data/device-data/device-operation/interface/device-operation';
import { CurrencyType } from '@prisma/client';
import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';

@Injectable()
export class FindMethodsDeviceOperationUseCase {
  constructor(
    private readonly deviceOperationRepository: IDeviceOperationRepository,
  ) {}
  async getAllByFilter(data: {
    ability?: any;
    organizationId?: number;
    posId?: number;
    carWashDeviceId?: number;
    dateStart?: Date;
    dateEnd?: Date;
    currencyType?: CurrencyType;
    skip?: number;
    take?: number;
  }): Promise<DeviceOperation[]> {
    return await this.deviceOperationRepository.findAllByFilter(
      data.ability,
      data.organizationId,
      data.posId,
      data.carWashDeviceId,
      data.dateStart,
      data.dateEnd,
      data.currencyType,
      data.skip,
      data.take,
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

  async getCountAllByDeviceIdAndDateOper(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return await this.deviceOperationRepository.countAllByDeviceIdAndDateOper(
      deviceId,
      dateStart,
      dateEnd,
    );
  }
}
