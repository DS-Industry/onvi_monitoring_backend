import { Injectable } from '@nestjs/common';
import { ICashCollectionRepository } from '@finance/cashCollection/cashCollection/interface/cashCollection';
import { CashCollectionUpdateDto } from '@finance/cashCollection/cashCollection/use-cases/dto/cashCollection-update.dto';
import { User } from '@platform-user/user/domain/user';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';

@Injectable()
export class UpdateCashCollectionUseCase {
  constructor(
    private readonly cashCollectionRepository: ICashCollectionRepository,
  ) {}

  async execute(
    input: CashCollectionUpdateDto,
    oldCashCollection: CashCollection,
    user: User,
  ): Promise<CashCollection> {
    const {
      oldCashCollectionDate,
      cashCollectionDate,
      sendDate,
      status,
      sumFact,
      shortage,
      sumCard,
      countCar,
      virtualSum,
      averageCheck,
    } = input;

    oldCashCollection.oldCashCollectionDate = oldCashCollectionDate
      ? oldCashCollectionDate
      : oldCashCollection.oldCashCollectionDate;
    oldCashCollection.cashCollectionDate = cashCollectionDate
      ? cashCollectionDate
      : oldCashCollection.cashCollectionDate;
    oldCashCollection.sendDate = sendDate
      ? sendDate
      : oldCashCollection.sendDate;
    oldCashCollection.status = status ? status : oldCashCollection.status;
    oldCashCollection.sumFact = sumFact ?? oldCashCollection.sumFact;
    oldCashCollection.shortage = shortage ?? oldCashCollection.shortage;
    oldCashCollection.sumCard = sumCard ?? oldCashCollection.sumCard;
    oldCashCollection.countCar = countCar ?? oldCashCollection.countCar;
    oldCashCollection.virtualSum = virtualSum ?? oldCashCollection.virtualSum;
    oldCashCollection.averageCheck =
      averageCheck ?? oldCashCollection.averageCheck;

    oldCashCollection.updatedAt = new Date(Date.now());
    oldCashCollection.updatedById = user.id;
    return await this.cashCollectionRepository.update(oldCashCollection);
  }
}
