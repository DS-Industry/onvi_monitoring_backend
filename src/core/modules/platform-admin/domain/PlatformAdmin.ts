export class PlatformAdmin {
  id?: number;
  name: string;
  surname?: string;
  middlename?: string;
  birthday?: Date;
  phone: string;
  email: string;
  gender: string;
  status: string;
  avatar?: string;
  country: string;
  countryCode: number;
  timezone: number;
  refreshTokenId?: string;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(
    name: string,
    phone: string,
    email: string,
    gender: string,
    status: string,
    country: string,
    countryCode: number,
    timezone: number,
    {
      id,
      surname,
      middlename,
      birthday,
      avatar,
      refreshTokenId,
      createdAt,
      updatedAt,
    }: {
      id?: number;
      surname?: string;
      middlename?: string;
      birthday?: Date;
      avatar?: string;
      refreshTokenId?: string;
      createdAt?: Date;
      updatedAt?: Date;
    },
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.middlename = middlename;
    this.birthday = birthday;
    this.phone = phone;
    this.email = email;
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

  public static create(data: any) {}
}
