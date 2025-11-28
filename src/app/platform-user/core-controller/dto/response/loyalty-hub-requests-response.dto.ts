import { LTYProgramRequestStatus } from '@prisma/client';

export class LoyaltyHubRequestsResponseDto {
  id: number;
  ltyProgramId: number;
  ltyProgramName: string;
  organizationId: number;
  organizationName: string;
  status: LTYProgramRequestStatus;
  requestedAt: Date;
  reviewedAt?: Date;
  approvedAt?: Date;
  reviewedBy?: number;
  reviewerName?: string;
  requestComment?: string;
  responseComment?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class LoyaltyHubRequestsListResponseDto {
  data: LoyaltyHubRequestsResponseDto[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}
