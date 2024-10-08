export class AuthRegisterWorkerDto {
  email: string;
  confirmString: string;
  name: string;
  surname: string;
  middlename?: string;
  birthday?: Date;
  phone?: string;
  password: string;
  gender: string;
  avatar?: string;
  country: string;
  countryCode: number;
  timezone: number;
}
