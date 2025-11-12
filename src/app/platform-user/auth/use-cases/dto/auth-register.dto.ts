export class AuthRegisterDto {
  name: string;
  surname?: string;
  middlename?: string;
  birthday?: Date;
  phone: string;
  email: string;
  password: string;
  fcmToken?: string;
}
