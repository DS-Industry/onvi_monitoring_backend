import { Injectable } from '@nestjs/common';
import { CashCollectionDeviceDataDto } from '@finance/cashCollection/cashCollection/use-cases/dto/cashCollection-recalculate.dto';
import { FindMethodsCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { CurrencyView } from '@prisma/client';
import { CountCarDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-count-car';
import { FindMethodsDeviceOperationCardUseCase } from '@pos/device/device-data/device-data/device-operation-card/use-cases/device-operation-card-find-methods';
import { UpdateCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-update';

@Injectable()
export class UpdateManyCashCollectionDeviceUseCase {
  constructor(
    private readonly updateCashCollectionDeviceUseCase: UpdateCashCollectionDeviceUseCase,
    private readonly findMethodsCashCollectionDeviceUseCase: FindMethodsCashCollectionDeviceUseCase,
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly countCarDeviceProgramUseCase: CountCarDeviceProgramUseCase,
    private readonly findMethodsDeviceOperationCardUseCase: FindMethodsDeviceOperationCardUseCase,
  ) {}

  async execute(data: CashCollectionDeviceDataDto[]): Promise<void> {
    const sumCoinMap = new Map<number, number>();
    const sumPaperMap = new Map<number, number>();
    const virtualSumMap = new Map<number, number>();

    await Promise.all(
      data.map(async (updateData) => {
        const oldCashCollectionDevice =
          await this.findMethodsCashCollectionDeviceUseCase.getOneById(
            updateData.cashCollectionDeviceId,
          );
        const deviceOperations =
          await this.findMethodsDeviceOperationUseCase.getAllByDeviceIdAndDateUseCase(
            oldCashCollectionDevice.carWashDeviceId,
            oldCashCollectionDevice.oldTookMoneyTime,
            updateData.tookMoneyTime,
          );
        await Promise.all(
          deviceOperations.map(async (deviceOperation) => {
            const operSum = deviceOperation.operSum;
            const deviceId = deviceOperation.carWashDeviceId;

            if (deviceOperation.currencyView == CurrencyView.COIN) {
              sumCoinMap.set(
                deviceId,
                (sumCoinMap.get(deviceId) || 0) + operSum,
              );
            } else if (deviceOperation.currencyView == CurrencyView.PAPER) {
              sumPaperMap.set(
                deviceId,
                (sumPaperMap.get(deviceId) || 0) + operSum,
              );
            } else {
              virtualSumMap.set(
                deviceId,
                (virtualSumMap.get(deviceId) || 0) + operSum,
              );
            }
          }),
        );

        const sumCoin =
          sumCoinMap.get(oldCashCollectionDevice.carWashDeviceId) || 0;
        const sumPaper =
          sumPaperMap.get(oldCashCollectionDevice.carWashDeviceId) || 0;
        const virtualSum =
          virtualSumMap.get(oldCashCollectionDevice.carWashDeviceId) || 0;

        const carCountDevice = await this.countCarDeviceProgramUseCase.execute(
          oldCashCollectionDevice.carWashDeviceId,
          oldCashCollectionDevice.oldTookMoneyTime,
          updateData.tookMoneyTime,
        );
        const deviceOperationCards =
          await this.findMethodsDeviceOperationCardUseCase.getAllByDeviceIdAndDateUseCase(
            oldCashCollectionDevice.carWashDeviceId,
            oldCashCollectionDevice.oldTookMoneyTime,
            updateData.tookMoneyTime,
          );
        const sumCardDevice = deviceOperationCards.reduce(
          (acc, card) => acc + card.sum,
          0,
        );

        await this.updateCashCollectionDeviceUseCase.execute(
          {
            tookMoneyTime: updateData.tookMoneyTime,
            sum: sumCoin + sumPaper,
            sumCoin: sumCoin,
            sumPaper: sumPaper,
            carCount: carCountDevice,
            sumCard: sumCardDevice,
            virtualSum: virtualSum,
          },
          oldCashCollectionDevice,
        );
      }),
    );
  }
}
