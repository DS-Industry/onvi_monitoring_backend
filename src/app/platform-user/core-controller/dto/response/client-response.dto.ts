import { StatusUser, UserType } from "@prisma/client";
import { TagProps } from "@loyalty/mobile-user/tag/domain/tag";

export class ClientResponseDto {
  id: number;
  name: string;
  phone: string;
  type: UserType;
  status: StatusUser;
  comment?: string;
  placementId?: number;
  tags: TagProps[];
}