import { Card } from './card.entity';

export interface ICardRepository {
  findByClientId(clientId: number): Promise<Card[]>;
  findOneByUnqNumber(unqNumber: string): Promise<Card | null>;
  findOneByUnqNumberWithClient(unqNumber: string): Promise<Card | null>;
  findCardTierByCardId(cardId: number): Promise<number | null>;
  delete(cardId: number): Promise<void>;
  lock(cardId: number): Promise<void>;
  reactivate(cardId: number): Promise<void>;
}
