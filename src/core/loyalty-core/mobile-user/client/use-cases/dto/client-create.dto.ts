import { UserType } from "@prisma/client";

export interface ClientCreateDto {
  name: string;
  birthday?: Date;
  phone: string;
  email?: string;
  gender?: string;
  type: UserType;
  inn?: string;
  comment?: string;
  placementId?: number;
  devNumber?: number;
  number?: number;
  monthlyLimit?: number;
  tagIds: number[];
}