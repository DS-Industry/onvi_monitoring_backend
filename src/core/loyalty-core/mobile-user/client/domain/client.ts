import { StatusUser, ContractType } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface ClientProps {
  id?: number;
  name: string;
  birthday?: Date;
  phone: string;
  email?: string;
  gender?: string;
  status?: StatusUser;
  avatar?: string;
  contractType: ContractType;
  comment?: string;
  placementId?: number;
  refreshTokenId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  mobileUserRoleId?: number;
  cardId?: number;
}

export class Client extends BaseEntity<ClientProps> {
  constructor(props: ClientProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get birthday(): Date {
    return this.props.birthday;
  }

  get phone(): string {
    return this.props.phone;
  }

  get email(): string {
    return this.props.email;
  }

  get gender(): string {
    return this.props.gender;
  }

  get status(): StatusUser {
    return this.props.status;
  }

  get avatar(): string {
    return this.props.avatar;
  }

  get contractType(): ContractType {
    return this.props.contractType;
  }

  get comment(): string {
    return this.props.comment;
  }

  get placementId(): number {
    return this.props.placementId;
  }

  get refreshTokenId(): string {
    return this.props.refreshTokenId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get mobileUserRoleId(): number {
    return this.props.mobileUserRoleId;
  }

  get cardId(): number {
    return this.props.cardId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set avatar(avatar: string) {
    this.props.avatar = avatar;
  }

  set birthday(birthday: Date) {
    this.props.birthday = birthday;
  }

  set status(status: StatusUser) {
    this.props.status = status;
  }

  set contractType(contractType: ContractType) {
    this.props.contractType = contractType;
  }

  set comment(comment: string) {
    this.props.comment = comment;
  }

  set placementId(placementId: number) {
    this.props.placementId = placementId;
  }

  set refreshTokenId(refreshTokenId: string) {
    this.props.refreshTokenId = refreshTokenId;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set mobileUserRoleId(mobileUserRoleId: number) {
    this.props.mobileUserRoleId = mobileUserRoleId;
  }

  set gender(gender: string) {
    this.props.gender = gender;
  }
}
