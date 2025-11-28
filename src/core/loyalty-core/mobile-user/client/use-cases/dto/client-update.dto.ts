import {
  StatusUser,
  ContractType,
} from '@loyalty/mobile-user/client/domain/enums';

export interface ClientUpdateDto {
  name?: string;
  birthday?: Date;
  status?: StatusUser;
  avatar?: string;
  contractType?: ContractType;
  comment?: string;
  placementId?: number;
  tagIds?: number[];
  refreshTokenId?: string;
  balance?: number;
  monthlyLimit?: number;
  loyaltyCardTierId?: number;
  gender?: string;
  cardId?: number;
  email?: string;
  is_notifications_enabled?: boolean;
}
