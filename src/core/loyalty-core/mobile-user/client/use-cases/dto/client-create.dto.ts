import { ContractType } from '@loyalty/mobile-user/client/domain/enums';

export interface ClientCreateDto {
  name: string;
  birthday?: Date;
  phone: string;
  email?: string;
  gender?: string;
  contractType: ContractType;
  comment?: string;
  placementId?: number;
  devNumber?: string;
  number?: string;
  monthlyLimit?: number;
  tagIds?: number[];
  cardId?: number;
}
