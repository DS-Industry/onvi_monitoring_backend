export class AuthRegisterDto {
  name: string;
  surname: string;
  middlename?: string;
  birthday?: Date;
  phone?: string;
  email: string;
  password: string;
  gender: string;
  avatar?: string;
  country: string;
  countryCode: number;
  timezone: number;
}