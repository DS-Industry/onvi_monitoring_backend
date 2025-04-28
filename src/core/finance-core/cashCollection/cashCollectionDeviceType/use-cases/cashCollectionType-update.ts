import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceTypeRepository } from '@finance/cashCollection/cashCollectionDeviceType/interface/cashCollectionDeviceType';
import { CashCollectionDeviceTypeUpdateDto } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/dto/cashCollectionDeviceType-update.dto';
import { CashCollectionDeviceType } from '@finance/cashCollection/cashCollectionDeviceType/domain/cashCollectionDeviceType';

@Injectable()
export class UpdateCashCollectionTypeUseCase {
  constructor(
    private readonly cashCollectionDeviceTypeRepository: ICashCollectionDeviceTypeRepository,
  ) {}

  async execute(
    input: CashCollectionDeviceTypeUpdateDto,
    oldCashCollectionDeviceType: CashCollectionDeviceType,
  ): Promise<CashCollectionDeviceType> {
    const { sumFact, sumCoin, sumPaper, shortage, virtualSum } = input;

    oldCashCollectionDeviceType.sumFact = sumFact
      ? sumFact
      : oldCashCollectionDeviceType.sumFact;
    oldCashCollectionDeviceType.sumCoin = sumCoin
      ? sumCoin
      : oldCashCollectionDeviceType.sumCoin;
    oldCashCollectionDeviceType.sumPaper = sumPaper
      ? sumPaper
      : oldCashCollectionDeviceType.sumPaper;
    oldCashCollectionDeviceType.shortage = shortage
      ? shortage
      : oldCashCollectionDeviceType.shortage;
    oldCashCollectionDeviceType.virtualSum = virtualSum
      ? virtualSum
      : oldCashCollectionDeviceType.virtualSum;

    return await this.cashCollectionDeviceTypeRepository.update(
      oldCashCollectionDeviceType,
    );
  }
}
