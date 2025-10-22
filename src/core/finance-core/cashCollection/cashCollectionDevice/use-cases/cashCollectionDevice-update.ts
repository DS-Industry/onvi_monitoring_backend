import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceRepository } from '@finance/cashCollection/cashCollectionDevice/interface/cashCollectionDevice';
import { CashCollectionDeviceUpdateDto } from '@finance/cashCollection/cashCollectionDevice/use-cases/dto/cashCollectionDevice-update.dto';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';

@Injectable()
export class UpdateCashCollectionDeviceUseCase {
  constructor(
    private readonly cashCollectionDeviceRepository: ICashCollectionDeviceRepository,
  ) {}

  async execute(
    input: CashCollectionDeviceUpdateDto,
    oldCashCollectionDevice: CashCollectionDevice,
  ): Promise<CashCollectionDevice> {
    const {
      oldTookMoneyTime,
      tookMoneyTime,
      sum,
      sumCoin,
      sumPaper,
      sumCard,
      carCount,
      virtualSum,
    } = input;

    oldCashCollectionDevice.oldTookMoneyTime = oldTookMoneyTime
      ? oldTookMoneyTime
      : oldCashCollectionDevice.oldTookMoneyTime;
    oldCashCollectionDevice.tookMoneyTime = tookMoneyTime
      ? tookMoneyTime
      : oldCashCollectionDevice.tookMoneyTime;
    oldCashCollectionDevice.sum = sum ? sum : oldCashCollectionDevice.sum;
    oldCashCollectionDevice.sumCoin = sumCoin
      ? sumCoin
      : oldCashCollectionDevice.sumCoin;
    oldCashCollectionDevice.sumPaper = sumPaper
      ? sumPaper
      : oldCashCollectionDevice.sumPaper;
    oldCashCollectionDevice.sumCard = sumCard
      ? sumCard
      : oldCashCollectionDevice.sumCard;
    oldCashCollectionDevice.carCount = carCount
      ? carCount
      : oldCashCollectionDevice.carCount;
    oldCashCollectionDevice.virtualSum = virtualSum
      ? virtualSum
      : oldCashCollectionDevice.virtualSum;

    return await this.cashCollectionDeviceRepository.update(
      oldCashCollectionDevice,
    );
  }
}
