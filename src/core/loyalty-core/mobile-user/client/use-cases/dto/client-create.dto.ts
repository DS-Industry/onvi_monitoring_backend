import { ContractType } from "@prisma/client";

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