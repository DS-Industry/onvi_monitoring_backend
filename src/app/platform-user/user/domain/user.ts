import { PositionUser, StatusUser } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface UserProps {
  id?: number;
  userRoleId: number;
  name: string;
  surname: string;
  middlename?: string;
  birthday?: Date;
  phone?: string;
  email: string;
  password: string;
  gender: string;
  position: PositionUser;
  status?: StatusUser;
  avatar?: string;
  country: string;
  countryCode: number;
  timezone: number;
  refreshTokenId?: string;
  receiveNotifications?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends BaseEntity<UserProps> {
  constructor(props: UserProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get userRoleId(): number {
    return this.props.userRoleId;
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

  get position(): PositionUser {
    return this.props.position;
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

  get receiveNotifications(): number {
    return this.props.receiveNotifications;
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

  set userRoleId(userRoleId: number) {
    this.props.userRoleId = userRoleId;
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

  set password(password: string) {
    this.props.password = password;
  }

  set phone(phone: string) {
    this.props.phone = phone;
  }

  set email(email: string) {
    this.props.email = email;
  }

  set avatar(avatar: string) {
    this.props.avatar = avatar;
  }

  set position(position: PositionUser) {
    this.props.position = position;
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

  set receiveNotifications(receiveNotifications: number) {
    this.props.receiveNotifications = receiveNotifications;
  }

  set refreshTokenId(refreshTokenId: string) {
    this.props.refreshTokenId = refreshTokenId;
  }
}
