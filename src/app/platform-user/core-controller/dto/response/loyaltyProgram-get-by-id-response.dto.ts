import { LTYProgramStatus } from '@prisma/client';

export class LoyaltyProgramGetByIdResponseDto {
  id: number;
  name: string;
  status: LTYProgramStatus;
  startDate: Date;
  isHub: boolean;
  isHubRequested: boolean;
  organizations: {
    id: number;
    name: string;
  }[];
  lifetimeDays?: number;
}
