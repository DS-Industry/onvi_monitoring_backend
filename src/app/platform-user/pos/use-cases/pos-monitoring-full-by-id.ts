import { Injectable } from '@nestjs/common';
import { GetByIdPosUseCase } from '@pos/pos/use-cases/pos-get-by-id';
import { PosMonitoringFullDto } from '@platform-user/pos/controller/dto/pos-monitoring-full.dto';
import { PosMonitoringFullResponseDto } from '@platform-user/pos/controller/dto/pos-monitoring-full-response.dto';
import { GetAllByPosCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-all-by-pos';
import { GetFullDataByPosIdDeviceOperationResponseUseCase } from '@device/device-operation/use-cases/device-operation-get-full-data-by-pos-id-response';

@Injectable()
export class MonitoringFullByIdPosUseCase {
  constructor(
    private readonly getByIdPosUseCase: GetByIdPosUseCase,
    private readonly getAllByPosCarWashDeviceUseCase: GetAllByPosCarWashDeviceUseCase,
    private readonly getFullDataByPosIdDeviceOperationResponseUseCase: GetFullDataByPosIdDeviceOperationResponseUseCase,
  ) {}

  async execute(
    input: PosMonitoringFullDto,
  ): Promise<PosMonitoringFullResponseDto[]> {
    const response: PosMonitoringFullResponseDto[] = [];
    const pos = await this.getByIdPosUseCase.execute(input.posId);
    const devices = await this.getAllByPosCarWashDeviceUseCase.execute(pos.id);

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
