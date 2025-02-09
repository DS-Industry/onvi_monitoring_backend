import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';

export abstract class ICashCollectionRepository {
  abstract create(input: CashCollection): Promise<CashCollection>;
  abstract findOneById(id: number): Promise<CashCollection>;
  abstract findLastSendByPosId(posId: number): Promise<CashCollection>;
  abstract update(input: CashCollection): Promise<CashCollection>;
  abstract findAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<CashCollection[]>;
  abstract countAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number>;
}
