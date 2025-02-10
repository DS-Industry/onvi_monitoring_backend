import { Injectable } from '@nestjs/common';
import { CashCollectionDeviceDataDto } from '@finance/cashCollection/cashCollection/use-cases/dto/cashCollection-recalculate.dto';
import { FindMethodsCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { CurrencyView } from '@prisma/client';
import { CountCarDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-count-car';
import { FindMethodsDeviceOperationCardUseCase } from '@pos/device/device-data/device-data/device-operation-card/use-cases/device-operation-card-find-methods';
import { UpdateCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-update';
import { CalculateMethodsCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-calculate-methods';

@Injectable()
export class UpdateManyCashCollectionDeviceUseCase {
  constructor(
    private readonly calculateMethodsCashCollectionUseCase: CalculateMethodsCashCollectionUseCase,
    private readonly updateCashCollectionDeviceUseCase: UpdateCashCollectionDeviceUseCase,
    private readonly findMethodsCashCollectionDeviceUseCase: FindMethodsCashCollectionDeviceUseCase,
  ) {}

  async execute(data: CashCollectionDeviceDataDto[]): Promise<void> {
    await Promise.all(
      data.map(async (updateData) => {
        const oldCashCollectionDevice =
          await this.findMethodsCashCollectionDeviceUseCase.getOneById(
            updateData.cashCollectionDeviceId,
          );
        const { sumCoin, sumPaper, virtualSum, carCount, sumCard } =
          await this.calculateMethodsCashCollectionUseCase.calculateDeviceSumsAndOperations(
            oldCashCollectionDevice.carWashDeviceId,
            oldCashCollectionDevice.oldTookMoneyTime,
            updateData.tookMoneyTime,
          );

        await this.updateCashCollectionDeviceUseCase.execute(
          {
            tookMoneyTime: updateData.tookMoneyTime,
            sum: sumCoin + sumPaper,
            sumCoin,
            sumPaper,
            carCount,
            sumCard,
            virtualSum,
          },
          oldCashCollectionDevice,
        );
      }),
    );
  }
}
