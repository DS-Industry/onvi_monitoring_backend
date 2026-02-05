import { StatusCard } from "@prisma/client";

export interface CardUpdateDto {
  balance?: number;
  monthlyLimit?: number;
  loyaltyCardTierId?: number;
  mobileUserId?: number;
  status?: StatusCard;
}
