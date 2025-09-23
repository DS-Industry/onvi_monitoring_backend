import { LTYProgramStatus } from '@prisma/client';

export class PublicLoyaltyProgramResponseDto {
  id: number;
  name: string;
  status: LTYProgramStatus;
  startDate: Date;
  lifetimeDays?: number;
  ownerOrganizationId?: number;
  ownerOrganization?: {
    id: number;
    name: string;
  };
  isHub: boolean;
  isPublic: boolean;
}

export class PublicLoyaltyProgramsListResponseDto {
  programs: PublicLoyaltyProgramResponseDto[];
  total: number;
  page: number;
  size: number;
}
