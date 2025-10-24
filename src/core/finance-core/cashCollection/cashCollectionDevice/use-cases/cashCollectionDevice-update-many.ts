import { Injectable } from '@nestjs/common';
import { CashCollectionDeviceDataDto } from '@finance/cashCollection/cashCollection/use-cases/dto/cashCollection-recalculate.dto';
import { FindMethodsCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-find-methods';
import { UpdateCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-update';

@Injectable()
export class UpdateManyCashCollectionDeviceUseCase {
  constructor(
    private readonly updateCashCollectionDeviceUseCase: UpdateCashCollectionDeviceUseCase,
    private readonly findMethodsCashCollectionDeviceUseCase: FindMethodsCashCollectionDeviceUseCase,
  ) {}

  async execute(data: CashCollectionDeviceDataDto[]): Promise<void> {
    for (const updateData of data) {
      const oldCashCollectionDevice =
        await this.findMethodsCashCollectionDeviceUseCase.getOneById(
          updateData.cashCollectionDeviceId,
        );
      const recalculateData =
        await this.findMethodsCashCollectionDeviceUseCase.getRecalculateDataByDevice(
          updateData.cashCollectionDeviceId,
          updateData.tookMoneyTime,
          updateData.oldTookMoneyTime ?? oldCashCollectionDevice.oldTookMoneyTime,
        );

      await this.updateCashCollectionDeviceUseCase.execute(
        {
          oldTookMoneyTime:
            updateData.oldTookMoneyTime ?? oldCashCollectionDevice.oldTookMoneyTime,
          tookMoneyTime: recalculateData.tookMoneyTime,
          sum: recalculateData.sumCoin + recalculateData.sumPaper,
          sumCoin: recalculateData.sumCoin,
          sumPaper: recalculateData.sumPaper,
          carCount: recalculateData.carCount,
          sumCard: recalculateData.sumCard,
          virtualSum: recalculateData.virtualSum,
        },
        oldCashCollectionDevice,
      );
    }
  }
}
