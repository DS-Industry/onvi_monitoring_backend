import { LTYUser, ContractType, StatusUser } from '@prisma/client';

export class Client {
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

  constructor(data: Partial<Client>) {
    Object.assign(this, data);
  }

  public static fromPrisma(ltyUser: LTYUser): Client {
    return new Client({
      id: ltyUser.id,
      name: ltyUser.name,
      birthday: ltyUser.birthday,
      phone: ltyUser.phone,
      email: ltyUser.email,
      gender: ltyUser.gender,
      status: ltyUser.status,
      avatar: ltyUser.avatar,
      contractType: ltyUser.contractType,
      comment: ltyUser.comment,
      createdAt: ltyUser.createdAt,
      updatedAt: ltyUser.updatedAt,
      placementId: ltyUser.placementId,
      workerCorporateId: ltyUser.workerCorporateId,
      refreshTokenId: ltyUser.refreshTokenId,
    });
  }

  public toPrisma(): Partial<LTYUser> {
    return {
      id: this.id,
      name: this.name,
      birthday: this.birthday,
      phone: this.phone,
      email: this.email,
      gender: this.gender,
      status: this.status,
      avatar: this.avatar,
      contractType: this.contractType,
      comment: this.comment,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      placementId: this.placementId,
      workerCorporateId: this.workerCorporateId,
      refreshTokenId: this.refreshTokenId,
    };
  }

  public update(data: Partial<Client>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  public isActive(): boolean {
    return this.status === StatusUser.ACTIVE;
  }

  public getDisplayName(): string {
    return this.name || `Client ${this.phone}`;
  }
}
