import { LTYProgramRequestStatus } from '@prisma/client';

export class LoyaltyParticipantRequestsResponseDto {
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

export class LoyaltyParticipantRequestsListResponseDto {
  data: LoyaltyParticipantRequestsResponseDto[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}
