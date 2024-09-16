import { Injectable } from '@nestjs/common';
import { PosMonitoringResponseDto } from '@platform-user/pos/controller/dto/pos-monitoring-response.dto';
import { PosMonitoringDto } from '@platform-user/pos/controller/dto/pos-monitoring';
import { GetByIdPosUseCase } from '@pos/pos/use-cases/pos-get-by-id';
import { GetAllPosUseCase } from '@pos/pos/use-cases/pos-get-all';
import { PosResponseDto } from '@platform-user/pos/controller/dto/pos-response.dto';
import { GetDataByPosIdResponseDeviceOperationUseCase } from '@device/device-operation/use-cases/device-operation-get-data-by-pos-id-response';

@Injectable()
export class MonitoringPosUseCase {
  constructor(
    private readonly getByIdPosUseCase: GetByIdPosUseCase,
    private readonly getAllPosUseCase: GetAllPosUseCase,
    private readonly getDataByPosIdResponseDeviceOperationUseCase: GetDataByPosIdResponseDeviceOperationUseCase,
  ) {}

  async execute(input: PosMonitoringDto): Promise<PosMonitoringResponseDto[]> {
    const response: PosMonitoringResponseDto[] = [];
    let poses: PosResponseDto[] = [];
    if (input.posId) {
      poses.push(await this.getByIdPosUseCase.execute(input.posId));
    } else {
      poses = await this.getAllPosUseCase.execute();
    }
    await Promise.all(
      poses.map(async (pos) => {
        const deviceOperData =
          await this.getDataByPosIdResponseDeviceOperationUseCase.execute({
            carWashPosId: pos.id,
            dateStart: input.dateStart,
            dateEnd: input.dateEnd,
          });
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
