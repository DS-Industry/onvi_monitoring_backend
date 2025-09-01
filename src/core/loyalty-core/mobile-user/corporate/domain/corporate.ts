import { BaseEntity } from '@utils/entity';

export interface CorporateProps {
  id?: number;
  name: string;
  inn: string;
  address: string;
  ownerId: number;
  createdAt?: Date;
  updatedAt?: Date;
  ownerPhone?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerAvatar?: string;
  status?: string;
}

export class Corporate extends BaseEntity<CorporateProps> {
  constructor(props: CorporateProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
  }
  get inn(): string {
    return this.props.inn;
  }
  set inn(inn: string) {
    this.props.inn = inn;
  }
  get address(): string {
    return this.props.address;
  }
  get ownerPhone(): string {
    return this.props.ownerPhone;
  }
  get ownerName(): string {
    return this.props.ownerName;
  }
  get ownerEmail(): string {
    return this.props.ownerEmail;
  }
  get ownerAvatar(): string {
    return this.props.ownerAvatar;
  }
  get status(): string {
    return this.props.status;
  }
  set address(address: string) {
    this.props.address = address;
  }
  get ownerId(): number {
    return this.props.ownerId;
  }
  set ownerId(ownerId: number) {
    this.props.ownerId = ownerId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}
