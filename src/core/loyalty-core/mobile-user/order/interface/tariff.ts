export interface Tariff {
  bonus: number;
}

export abstract class ITariffRepository {
  abstract findCardTariff(cardId: number): Promise<Tariff | null>;
}
