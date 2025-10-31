import { StatusUser, ContractType } from "@loyalty/mobile-user/client/domain/enums";
import { TagProps } from "@loyalty/mobile-user/tag/domain/tag";

export class ClientResponseDto {
  id: number;
  name: string;
  phone: string;
  contractType: ContractType;
  status: StatusUser;
  comment?: string;
  placementId?: number;
  tags: TagProps[];
}