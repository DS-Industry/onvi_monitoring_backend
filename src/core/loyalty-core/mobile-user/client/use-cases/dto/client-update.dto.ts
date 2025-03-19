import { StatusUser, UserType } from "@prisma/client";

export interface ClientUpdateDto {
  name?: string;
  birthday?: Date;
  status?: StatusUser;
  avatar?: string;
  type?: UserType;
  inn?: string;
  comment?: string;
  placementId?: number;
  tagIds?: number[];
  refreshTokenId?: string;
  balance?: number;
  monthlyLimit?: number;
}