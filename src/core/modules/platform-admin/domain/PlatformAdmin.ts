import { CreatePlatformAdminDtp } from './dto/createPlatformAdminDtp';
import { StatusPlatformAdmin } from '@prisma/client';

export class PlatformAdmin {
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
  createdAt: Date;
  updatedAt: Date;

  private constructor(
    name: string,
    surname: string,
    email: string,
    password: string,
    gender: string,
    country: string,
    countryCode: number,
    timezone: number,
    createdAt: Date,
    updatedAt: Date,
    {
      id,
      middlename,
      phone,
      birthday,
      avatar,
      status,
      refreshTokenId,
    }: {
      id?: number;
      middlename?: string;
      phone?: string;
      birthday?: Date;
      avatar?: string;
      status?: StatusPlatformAdmin;
      refreshTokenId?: string;
    },
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.middlename = middlename;
    this.birthday = birthday;
    this.phone = phone;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.gender = gender;
    this.status = status;
    this.avatar = avatar;
    this.country = country;
    this.countryCode = countryCode;
    this.timezone = timezone;
    this.refreshTokenId = refreshTokenId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static create(createData: CreatePlatformAdminDtp): PlatformAdmin {
    const {
      name,
      surname,
      middlename,
      birthday,
      phone,
      email,
      password,
      gender,
      status,
      avatar,
      country,
      countryCode,
      timezone,
      refreshTokenId,
      createdAt,
      updatedAt,
    } = createData;
    return new PlatformAdmin(
      name,
      surname,
      email,
      password,
      gender,
      country,
      countryCode,
      timezone,
      createdAt,
      updatedAt,
      {
        middlename,
        phone,
        birthday,
        avatar,
        status,
        refreshTokenId,
      },
    );
  }
}
