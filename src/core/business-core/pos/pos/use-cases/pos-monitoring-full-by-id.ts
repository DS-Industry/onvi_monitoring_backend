import { Injectable } from '@nestjs/common';
import { PosMonitoringFullResponseDto } from '@platform-user/pos/controller/dto/pos-monitoring-full-response.dto';
import { GetFullDataByPosIdDeviceOperationResponseUseCase } from '@device/device-operation/use-cases/device-operation-get-full-data-by-pos-id-response';
import { PosMonitoringFullDto } from "@pos/pos/use-cases/dto/pos-monitoring-full.dto";
import { FindMethodsPosUseCase } from "@pos/pos/use-cases/pos-find-methods";
import { FindMethodsCarWashDeviceUseCase } from "@pos/device/device/use-cases/car-wash-device-find-methods";

@Injectable()
export class MonitoringFullByIdPosUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly getFullDataByPosIdDeviceOperationResponseUseCase: GetFullDataByPosIdDeviceOperationResponseUseCase,
  ) {}

  async execute(
    input: PosMonitoringFullDto,
  ): Promise<PosMonitoringFullResponseDto[]> {
    const response: PosMonitoringFullResponseDto[] = [];
    const pos = await this.findMethodsPosUseCase.getById(input.posId);
    const devices = await this.findMethodsCarWashDeviceUseCase.getAllByPos(pos.id);

    await Promise.all(
      devices.map(async (device) => {
        const deviceOperData =
          await this.getFullDataByPosIdDeviceOperationResponseUseCase.execute({
            deviceId: device.id,
            dateStart: input.dateStart,
            dateEnd: input.dateEnd,
          });
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
