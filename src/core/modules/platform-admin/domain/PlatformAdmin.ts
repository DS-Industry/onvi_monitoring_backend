export class PlatformAdmin {
  id?: number;
  name: string;
  surname: string;
  middlename?: string;
  birthday?: Date;
  phone: string;
  email: string;
  password: string;
  gender: string;
  status: string;
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
    phone: string,
    email: string,
    password: string,
    gender: string,
    status: string,
    country: string,
    countryCode: number,
    timezone: number,
    createdAt: Date,
    updatedAt: Date,
    {
      id,
      middlename,
      birthday,
      avatar,
      refreshTokenId,
    }: {
      id?: number;
      middlename?: string;
      birthday?: Date;
      avatar?: string;
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

  public static create(data: any): PlatformAdmin {
    const {
      name,
      surname,
      middlename,
      birthday,
      phone,
      email,
      password,
      gender,
      avatar,
      country,
      countryCode,
      timezone,
      refreshTokenId,
      createdAt,
      updatedAt,
    } = data;
    const status = 'Active';
    return new PlatformAdmin(
      name,
      surname,
      phone,
      email,
      password,
      gender,
      status,
      country,
      countryCode,
      timezone,
      createdAt,
      updatedAt,
      {
        middlename,
        birthday,
        avatar,
        refreshTokenId,
      },
    );
  }
}
