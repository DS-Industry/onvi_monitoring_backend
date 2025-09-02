export class CorporateCardResponseDto {
  id: number;
  ownerName: string;
  cardUnqNumber: string;
  cardNumber: string;
  cardBalance: number;
  cardTier?: {
    name: string;
    limitBenefit: number;
  } | null;
}
