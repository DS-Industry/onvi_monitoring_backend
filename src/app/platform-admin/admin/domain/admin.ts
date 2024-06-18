import { BaseEntity } from '@utils/entity';
import { StatusUser } from '@prisma/client';

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
  status?: StatusUser;
  avatar?: string;
  country: string;
  countryCode: number;
  timezone: number;
  refreshTokenId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  platformUserRoleId: number;
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

  get status(): StatusUser {
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

  get platformUserRoleId(): number {
    return this.props.platformUserRoleId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set surname(surname: string) {
    this.props.surname = surname;
  }

  set middlename(middlename: string) {
    this.props.middlename = middlename;
  }

  set avatar(avatar: string) {
    this.props.avatar = avatar;
  }

  set password(password: string) {
    this.props.password = password;
  }

  set status(status: StatusUser) {
    this.props.status = status;
  }

  set country(country: string) {
    this.props.country = country;
  }

  set countryCode(countryCode: number) {
    this.props.countryCode = countryCode;
  }

  set timezone(timezone: number) {
    this.props.timezone = timezone;
  }

  set refreshTokenId(refreshTokenId: string) {
    this.props.refreshTokenId = refreshTokenId;
  }

  set platformUserRoleId(platformUserRoleId: number) {
    this.props.platformUserRoleId = platformUserRoleId;
  }
}
