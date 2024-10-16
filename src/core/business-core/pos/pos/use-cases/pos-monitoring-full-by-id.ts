import { Injectable } from '@nestjs/common';
import { PosMonitoringFullResponseDto } from '@platform-user/core-controller/dto/response/pos-monitoring-full-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { DataDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-data';
import { ForbiddenError } from "@casl/ability";
import { PermissionAction } from "@prisma/client";
import { Pos } from "@pos/pos/domain/pos";

@Injectable()
export class MonitoringFullByIdPosUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly dataDeviceOperationUseCase: DataDeviceOperationUseCase,
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    pos: Pos,
  ): Promise<PosMonitoringFullResponseDto[]> {
    const response: PosMonitoringFullResponseDto[] = [];
    const devices = await this.findMethodsCarWashDeviceUseCase.getAllByPos(
      pos.id,
    );

    await Promise.all(
      devices.map(async (device) => {
        const deviceOperations =
          await this.findMethodsDeviceOperationUseCase.getAllByDeviceIdAndDateUseCase(
            device.id,
            dateStart,
            dateEnd,
          );
        const lastOper =
          await this.findMethodsDeviceOperationUseCase.getLastByDeviceIdUseCase(
            device.id,
          );

        const deviceOperData = await this.dataDeviceOperationUseCase.execute(
          deviceOperations,
          lastOper,
        );
        response.push({
          id: device.id,
          name: device.name,
          counter: deviceOperData.counter,
          cashSum: deviceOperData.cashSum,
          virtualSum: deviceOperData.virtualSum,
          yandexSum: deviceOperData.yandexSum,
          mobileSum: 0,
          cardSum: 0,
          lastOper: deviceOperData.lastOper,
          discountSum: 0,
          cashbackSumCard: 0,
          cashbackSumMub: 0,
        });
      }),
    );

    return response;
  }
}
