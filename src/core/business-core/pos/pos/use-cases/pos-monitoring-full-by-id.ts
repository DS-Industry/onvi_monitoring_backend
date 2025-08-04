import { Injectable } from '@nestjs/common';
import { PosMonitoringFullResponseDto } from '@platform-user/core-controller/dto/response/pos-monitoring-full-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { CurrencyType } from '@prisma/client';
import { Pos } from '@pos/pos/domain/pos';
import { FindMethodsCurrencyUseCase } from '@pos/device/device-data/currency/currency/use-case/currency-find-methods';

@Injectable()
export class MonitoringFullByIdPosUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsCurrencyUseCase: FindMethodsCurrencyUseCase,
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

    //const currencyCache = new Map<number, CurrencyType>();
    const cashSumMap = new Map<number, number>();
    const virtualSumMap = new Map<number, number>();
    const yandexSumMap = new Map<number, number>();

    await Promise.all(
      devices.map(async (device) => {
        const deviceOperations =
          await this.findMethodsDeviceOperationUseCase.getAllByFilter({
            carWashDeviceId: device.id,
            dateStart: dateStart,
            dateEnd: dateEnd,
          });

        const lastOper =
          await this.findMethodsDeviceOperationUseCase.getLastByDeviceIdUseCase(
            device.id,
          );

        await Promise.all(
          deviceOperations.map(async (deviceOperation) => {
            /*if (!currencyCache.has(deviceOperation.currencyId)) {
              const cur = await this.findMethodsCurrencyUseCase.getById(
                deviceOperation.currencyId,
              );
              currencyCache.set(deviceOperation.currencyId, cur.currencyType);
            }
            const curType = currencyCache.get(deviceOperation.currencyId);*/
            const operSum = deviceOperation.operSum;
            const deviceId = deviceOperation.carWashDeviceId;

            if (deviceOperation.currencyType == CurrencyType.CASH) {
              cashSumMap.set(
                deviceId,
                (cashSumMap.get(deviceId) || 0) + operSum,
              );
            } else if (deviceOperation.currencyType == CurrencyType.CASHLESS) {
              virtualSumMap.set(
                deviceId,
                (virtualSumMap.get(deviceId) || 0) + operSum,
              );
            } else if (deviceOperation.currencyType == CurrencyType.VIRTUAL) {
              yandexSumMap.set(
                deviceId,
                (yandexSumMap.get(deviceId) || 0) + operSum,
              );
            }
          }),
        );
        response.push({
          id: device.id,
          name: device.name,
          counter: deviceOperations.length,
          cashSum: cashSumMap.get(device.id) || 0,
          virtualSum: virtualSumMap.get(device.id) || 0,
          yandexSum: yandexSumMap.get(device.id) || 0,
          mobileSum: 0,
          cardSum: 0,
          lastOper: lastOper ? lastOper.operDate : null,
          discountSum: 0,
          cashbackSumCard: 0,
          cashbackSumMub: 0,
        });
      }),
    );

    return response;
  }
}
