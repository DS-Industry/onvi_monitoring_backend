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
    const oldCashCollectionDevices = await Promise.all(
      data.map((updateData) =>
        this.findMethodsCashCollectionDeviceUseCase.getOneById(
          updateData.cashCollectionDeviceId,
        ),
      ),
    );

    const recalculatePromises = data.map(async (updateData, index) => {
      const oldDevice = oldCashCollectionDevices[index];
      const recalculateData =
        await this.findMethodsCashCollectionDeviceUseCase.getRecalculateDataByDevice(
          updateData.cashCollectionDeviceId,
          updateData.tookMoneyTime,
          updateData.oldTookMoneyTime ?? oldDevice.oldTookMoneyTime,
        );
      return { updateData, oldDevice, recalculateData };
    });

    const preparedData = await Promise.all(recalculatePromises);

    await Promise.all(
      preparedData.map(({ updateData, oldDevice, recalculateData }) =>
        this.updateCashCollectionDeviceUseCase.execute(
          {
            oldTookMoneyTime:
              updateData.oldTookMoneyTime ?? oldDevice.oldTookMoneyTime,
            tookMoneyTime: recalculateData.tookMoneyTime,
            sum: recalculateData.sumCoin + recalculateData.sumPaper,
            sumCoin: recalculateData.sumCoin,
            sumPaper: recalculateData.sumPaper,
            carCount: recalculateData.carCount,
            sumCard: recalculateData.sumCard,
            virtualSum: recalculateData.virtualSum,
          },
          oldDevice,
        ),
      ),
    );
  }
}
