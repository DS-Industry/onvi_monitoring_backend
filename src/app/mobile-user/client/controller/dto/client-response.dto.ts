import { StatusUser, ContractType } from '@loyalty/mobile-user/client/domain/enums';

export class ClientResponseDto {
  id: number;
  name: string;
  birthday?: Date;
  phone: string;
  email?: string;
  gender?: string;
  status: StatusUser;
  avatar?: string;
  contractType: ContractType;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  placementId?: number;
  workerCorporateId?: number;
  refreshTokenId?: string;
  tags?: any[];
  card?: any;

  constructor(client: any) {
    this.id = client.id;
    this.name = client.name;
    this.birthday = client.birthday;
    this.phone = client.phone;
    this.email = client.email;
    this.gender = client.gender;
    this.status = client.status;
    this.avatar = client.avatar;
    this.contractType = client.contractType;
    this.comment = client.comment;
    this.createdAt = client.createdAt;
    this.updatedAt = client.updatedAt;
    this.placementId = client.placementId;
    this.workerCorporateId = client.workerCorporateId;
    this.refreshTokenId = client.refreshTokenId;
    this.tags = client.tags;
    this.card = client.card;
  }
}
