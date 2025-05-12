import { LoyaltyProgramStatus } from "@prisma/client";

export class LoyaltyProgramGetByIdResponseDto {
  id: number;
  name: string;
  status: LoyaltyProgramStatus;
  startDate: Date;
  organizationIds: number[];
  lifetimeDays?: number;
}