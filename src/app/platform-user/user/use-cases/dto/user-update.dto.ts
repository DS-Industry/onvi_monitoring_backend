import { PositionUser, StatusUser } from '@prisma/client';

export class UpdateUserDto {
  id: number;
  name?: string;
  surname?: string;
  middlename?: string;
  password?: string;
  phone?: string;
  email?: string;
  position?: PositionUser;
  status?: StatusUser;
  refreshTokenId?: string;
  fcmToken?: string;
  receiveNotifications?: number;
  roleId?: number;
}
