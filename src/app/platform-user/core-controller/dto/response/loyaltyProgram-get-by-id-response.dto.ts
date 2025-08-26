import { LTYProgramStatus } from '@prisma/client';

export class LoyaltyProgramGetByIdResponseDto {
  id: number;
  name: string;
  status: LTYProgramStatus;
  startDate: Date;
  organizations: {
    id: number;
    name: string;
  }[];
  lifetimeDays?: number;
}
