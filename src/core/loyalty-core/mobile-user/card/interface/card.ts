import { Card } from '@loyalty/mobile-user/card/domain/card';

export abstract class ICardRepository {
  abstract create(input: Card): Promise<Card>;
  abstract findOneById(id: number): Promise<Card>;
  abstract findOneByClientId(id: number): Promise<Card>;
  abstract findOneByDevNumber(devNumber: number): Promise<Card>;
  abstract findOneByNumber(number: number): Promise<Card>;
  abstract update(input: Card): Promise<Card>;
}
