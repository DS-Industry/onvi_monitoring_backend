import { BaseEntity } from '@utils/entity';
import { StatusPlatformAdmin } from '@prisma/client';


export interface AdminProps {
  id?: number;
  name: string;
  surname: string;
  middlename?: string;
  birthday?: Date;
  phone?: string;
  email: string;
  password: string;
  gender: string;
  status?: StatusPlatformAdmin;
  avatar?: string;
  country: string;
  countryCode: number;
  timezone: number;
  refreshTokenId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Admin extends BaseEntity<AdminProps> {
  constructor(props: AdminProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get surname(): string {
    return this.props.surname;
  }

  get middlename(): string {
    return this.props.middlename;
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
  get password(): string {
    return this.props.password;
  }

  get gender(): string {
    return this.props.gender;
  }

  get status(): StatusPlatformAdmin {
    return this.props.status;
  }

  get avatar(): string {
    return this.props.avatar;
  }

  get country(): string {
    return this.props.country;
  }

  get countryCode(): number {
    return this.props.countryCode;
  }

  get timezone(): number {
    return this.props.timezone;
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
}
