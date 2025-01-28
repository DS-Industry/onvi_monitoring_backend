import { Injectable } from '@nestjs/common';
import { PosMonitoringResponseDto } from '@platform-user/core-controller/dto/response/pos-monitoring-response.dto';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { Pos } from '@pos/pos/domain/pos';
import { CreateFullDataPosUseCase } from '@pos/pos/use-cases/pos-create-full-data';
import { CurrencyType } from '@prisma/client';
import { FindMethodsCurrencyUseCase } from '@pos/device/device-data/currency/currency/use-case/currency-find-methods';

@Injectable()
export class MonitoringPosUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsCurrencyUseCase: FindMethodsCurrencyUseCase,
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

    const cashSumMap = new Map<number, number>();
    const virtualSumMap = new Map<number, number>();
    const yandexSumMap = new Map<number, number>();

    await Promise.all(
      poses.map(async (pos) => {
        const posOperations =
          await this.findMethodsDeviceOperationUseCase.getAllByPosIdAndDateUseCase(
            pos.id,
            dateStart,
            dateEnd,
          );
        const lastOper =
          await this.findMethodsDeviceOperationUseCase.getLastByPosIdUseCase(
            pos.id,
          );

        await Promise.all(
          posOperations.map(async (posOperation) => {
            const operSum = posOperation.operSum;
            const posId = pos.id;

            if (posOperation.currencyType == CurrencyType.CASH) {
              cashSumMap.set(posId, (cashSumMap.get(posId) || 0) + operSum);
            } else if (posOperation.currencyType == CurrencyType.CASHLESS) {
              virtualSumMap.set(
                posId,
                (virtualSumMap.get(posId) || 0) + operSum,
              );
            } else if (posOperation.currencyType == CurrencyType.VIRTUAL) {
              yandexSumMap.set(posId, (yandexSumMap.get(posId) || 0) + operSum);
            }
          }),
        );
        response.push({
          id: pos.id,
          name: pos.name,
          city: pos.address.city,
          counter: posOperations.length,
          cashSum: cashSumMap.get(pos.id) || 0,
          virtualSum: virtualSumMap.get(pos.id) || 0,
          yandexSum: yandexSumMap.get(pos.id) || 0,
          mobileSum: 0,
          cardSum: 0,
          lastOper: lastOper ? lastOper.operDate : undefined,
          discountSum: 0,
          cashbackSumCard: 0,
          cashbackSumMub: 0,
        });
      }),
    );
    return response;
  }
}
