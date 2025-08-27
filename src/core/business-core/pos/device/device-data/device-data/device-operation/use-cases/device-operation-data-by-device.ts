import { Injectable } from '@nestjs/common';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import {
  DeviceOperationMonitoringResponseDto,
  MonitoringDto,
} from '@platform-user/core-controller/dto/response/device-operation-monitoring-response.dto';
import { CurrencyType } from '@prisma/client';

@Injectable()
export class DataByDeviceOperationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
  ) {}

  async execute(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
    currencyType?: CurrencyType,
    skip?: number,
    take?: number,
  ): Promise<DeviceOperationMonitoringResponseDto> {
    const response: MonitoringDto[] = [];
    const totalCount =
      await this.findMethodsDeviceOperationUseCase.getCountByFilter({
        carWashDeviceId: deviceId,
        dateStart: dateStart,
        dateEnd: dateEnd,
        currencyType: currencyType,
      });
    const deviceOperations =
      await this.findMethodsDeviceOperationUseCase.getAllByFilter({
        carWashDeviceId: deviceId,
        dateStart: dateStart,
        dateEnd: dateEnd,
        currencyType: currencyType,
        skip: skip,
        take: take,
      });
    deviceOperations.map((deviceOperation) => {
      response.push({
        id: deviceOperation.id,
        sumOper: deviceOperation.operSum,
        dateOper: deviceOperation.operDate,
        dateLoad: deviceOperation.loadDate,
        counter: deviceOperation.counter,
        localId: deviceOperation.localId,
        currencyType: deviceOperation.currencyName,
      });
    });
    return { oper: response, totalCount: totalCount };
  }
}
