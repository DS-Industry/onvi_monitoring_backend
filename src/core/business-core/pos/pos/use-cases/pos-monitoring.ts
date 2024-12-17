import { Injectable } from '@nestjs/common';
import { PosMonitoringResponseDto } from '@platform-user/core-controller/dto/response/pos-monitoring-response.dto';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { DataDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-data';
import { Pos } from "@pos/pos/domain/pos";
import { CreateFullDataPosUseCase } from "@pos/pos/use-cases/pos-create-full-data";

@Injectable()
export class MonitoringPosUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly dataDeviceOperationUseCase: DataDeviceOperationUseCase,
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly posCreateFullDataUseCase: CreateFullDataPosUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
    pos?: Pos,
  ): Promise<PosMonitoringResponseDto[]> {
    const response: PosMonitoringResponseDto[] = [];
    let poses: PosResponseDto[] = [];
    if (pos) {
      poses.push(await this.posCreateFullDataUseCase.execute(pos));
    } else {
      poses = await this.findMethodsPosUseCase.getAllByAbility(ability);
    }
    await Promise.all(
      poses.map(async (pos) => {
        const deviceOperations =
          await this.findMethodsDeviceOperationUseCase.getAllByPosIdAndDateUseCase(
            pos.id,
            dateStart,
            dateEnd,
          );
        const lastOper =
          await this.findMethodsDeviceOperationUseCase.getLastByPosIdUseCase(
            pos.id,
          );

        const deviceOperData = await this.dataDeviceOperationUseCase.execute(
          deviceOperations,
          lastOper,
        );
        response.push({
          id: pos.id,
          name: pos.name,
          city: pos.address.city,
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
