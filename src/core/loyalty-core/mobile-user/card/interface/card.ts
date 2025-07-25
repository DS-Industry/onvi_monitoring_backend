import { Card } from '@loyalty/mobile-user/card/domain/card';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';

export abstract class ICardRepository {
  abstract create(input: Card): Promise<Card>;
  abstract findOneById(id: number): Promise<Card>;
  abstract findOneByClientId(id: number): Promise<Card>;
  abstract findOneByUnqNumber(unqNumber: string): Promise<Card>;
  abstract findOneByNumber(number: string): Promise<Card>;
  abstract findOneByClientPhone(phone: string): Promise<Card>;
  abstract findFullCardInfoForDevice(
    unqNumber: string,
  ): Promise<LoyaltyCardInfoFullResponseDto>;
  abstract update(input: Card): Promise<Card>;
}
