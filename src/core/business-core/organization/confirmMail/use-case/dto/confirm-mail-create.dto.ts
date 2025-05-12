import { PositionUser } from '@prisma/client';

export class ConfirmMailCreateDto {
  name: string;
  surname?: string;
  middlename?: string;
  birthday: Date;
  phone: string;
  email: string;
  organizationId: number;
  roleId: number;
  position: PositionUser;
}
