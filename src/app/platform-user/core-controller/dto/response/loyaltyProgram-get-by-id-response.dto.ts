import { LTYProgramStatus } from "@prisma/client";

export class LoyaltyProgramGetByIdResponseDto {
  id: number;
  name: string;
  status: LTYProgramStatus;
  startDate: Date;
  organizationIds: number[];
  lifetimeDays?: number;
}