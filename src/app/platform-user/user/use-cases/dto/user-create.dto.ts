import { StatusUser } from "@prisma/client";

export class CreateUserDto {
  name?: string;
  surname?: string;
  middlename?: string;
  phone?: string;
  email?: string;
  password?: string;
  avatar?: string;
  country?: string;
  gender?: string;
  countryCode?: number;
  timezone?: number;
  refreshTokenId?: string;
  status?: StatusUser;
  birthday?: Date;
  platformUserRoleId?: number;
}