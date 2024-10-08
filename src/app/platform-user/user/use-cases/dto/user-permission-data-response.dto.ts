import { PositionUser, StatusUser } from '@prisma/client';

export class UserPermissionDataResponseDto {
  id: number;
  name: string;
  surname: string;
  middlename: string;
  organizationName: string;
  position: PositionUser;
  roleName: string;
  status: StatusUser;
  createAt: Date;
}
