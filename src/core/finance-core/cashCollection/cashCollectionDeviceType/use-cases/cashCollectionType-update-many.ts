import { Injectable } from '@nestjs/common';
import { UpdateCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-update';
import { CashCollectionDeviceTypeDataDto } from '@finance/cashCollection/cashCollection/use-cases/dto/cashCollection-recalculate.dto';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { FindMethodsCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-find-methods';
import { CalculateMethodsCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-calculate-methods';

@Injectable()
export class UpdateManyCashCollectionTypeUseCase {
  constructor(
    private readonly calculateMethodsCashCollectionUseCase: CalculateMethodsCashCollectionUseCase,
    private readonly findMethodsCashCollectionTypeUseCase: FindMethodsCashCollectionTypeUseCase,
    private readonly updateCashCollectionTypeUseCase: UpdateCashCollectionTypeUseCase,
  ) {}

  async execute(
    cashCollectionId: number,
    data: CashCollectionDeviceTypeDataDto[],
    cashCollectionDevices: CashCollectionDevice[],
    devices: CarWashDevice[],
  ): Promise<void> {
    const dataMap = new Map<number, CashCollectionDeviceTypeDataDto>(
      data.map((d) => [d.cashCollectionDeviceTypeId, d]),
    );

    const cashSumMap =
      await this.calculateMethodsCashCollectionUseCase.calculateDeviceTypeSums(
        cashCollectionDevices,
        devices,
      );

    const cashCollectionDeviceTypes =
      await this.findMethodsCashCollectionTypeUseCase.getAllByCashCollectionId(
        cashCollectionId,
      );

    await Promise.all(
      cashCollectionDeviceTypes.map(async (cashCollectionDeviceType) => {
        const sums = cashSumMap.get(
          cashCollectionDeviceType.carWashDeviceTypeId,
        ) || { sum: 0, virtSum: 0 };

        const cashData = dataMap.get(cashCollectionDeviceType.id);
        const sumCoin = cashData?.sumCoin ?? cashCollectionDeviceType.sumCoin;
        const sumPaper =
          cashData?.sumPaper ?? cashCollectionDeviceType.sumPaper;

        await this.updateCashCollectionTypeUseCase.execute(
          {
            sumFact: sumCoin + sumPaper,
            sumCoin,
            sumPaper,
            shortage: sums.sum - (sumCoin + sumPaper),
            virtualSum: sums.virtSum,
          },
          cashCollectionDeviceType,
        );
      }),
    );
  }
}
