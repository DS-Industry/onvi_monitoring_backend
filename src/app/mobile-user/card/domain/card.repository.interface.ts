import { Card } from './card.entity';

export interface ICardRepository {
  findByClientId(clientId: number): Promise<Card[]>;
  findOneByUnqNumber(unqNumber: string): Promise<Card | null>;
  findOneByUnqNumberWithClient(unqNumber: string): Promise<Card | null>;
  findCardTierByCardId(cardId: number): Promise<number | null>;
  findFirstByClientId(clientId: number): Promise<Card | null>;
  findFirstByClientIdWithCardTier(clientId: number): Promise<Card | null>;
  findFirstByClientIdWithCardTierAndBenefits(clientId: number): Promise<Card | null>;
  updateBalance(cardId: number, newBalance: number, tx?: any): Promise<void>;
  delete(cardId: number, tx?: any): Promise<void>;
  lock(cardId: number): Promise<void>;
  reactivate(cardId: number): Promise<void>;
  findActiveCards(clientId: number): Promise<Card[]>;
}
