import { StatusUser, ContractType } from '@prisma/client';
import { TagProps } from "@loyalty/mobile-user/tag/domain/tag";

export class ClientFullResponseDto {
  id: number;
  name: string;
  birthday?: Date;
  phone: string;
  email?: string;
  gender?: string;
  status: StatusUser;
  contractType: ContractType;
  comment?: string;
  refreshTokenId?: string;
  placementId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  tags: TagProps[];
  card: CardResponseDto;
}

export class CardResponseDto {
  id?: number;
  balance: number;
  mobileUserId: number;
  devNumber: string;
  number: string;
  monthlyLimit?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
