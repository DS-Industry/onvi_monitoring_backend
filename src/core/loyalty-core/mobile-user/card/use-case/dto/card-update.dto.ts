import { CardStatus } from "../../domain/enums";

export interface CardUpdateDto {
  balance?: number;
  monthlyLimit?: number;
  loyaltyCardTierId?: number;
  mobileUserId?: number;
  status?: CardStatus;
}
