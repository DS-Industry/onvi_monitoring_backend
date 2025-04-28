import { Card } from '@loyalty/mobile-user/card/domain/card';

export abstract class ICardRepository {
  abstract create(input: Card): Promise<Card>;
  abstract findOneById(id: number): Promise<Card>;
  abstract findOneByClientId(id: number): Promise<Card>;
  abstract findOneByDevNumber(devNumber: string): Promise<Card>;
  abstract findOneByNumber(number: string): Promise<Card>;
  abstract findOneByClientPhone(phone: string): Promise<Card>;
  abstract update(input: Card): Promise<Card>;
}
