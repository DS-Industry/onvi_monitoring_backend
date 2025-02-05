import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';

export abstract class ICashCollectionRepository {
  abstract create(input: CashCollection): Promise<CashCollection>;
  abstract findOneById(id: number): Promise<CashCollection>;
}
