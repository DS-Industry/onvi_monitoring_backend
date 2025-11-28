import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';

export abstract class ICashCollectionRepository {
  abstract create(input: CashCollection): Promise<CashCollection>;
  abstract findOneById(id: number): Promise<CashCollection>;
  abstract findLastSendByPosId(posId: number): Promise<CashCollection>;
  abstract update(input: CashCollection): Promise<CashCollection>;
  abstract findAllByPosIdsAndDate(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<CashCollection[]>;
  abstract countAllByPosIdsAndDate(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number>;
  abstract delete(id: number): Promise<void>;
}
