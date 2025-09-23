import { LTYProgramRequestStatus } from '@prisma/client';
import { LoyaltyParticipantRequestsFilterDto } from '@platform-user/core-controller/dto/receive/loyalty-participant-requests-filter.dto';
import { LoyaltyParticipantRequestsListResponseDto } from '@platform-user/core-controller/dto/response/loyalty-participant-requests-response.dto';

export abstract class ILoyaltyProgramParticipantRequestRepository {
  abstract create(
    ltyProgramId: number,
    organizationId: number,
    status: LTYProgramRequestStatus,
    requestComment?: string,
  ): Promise<any>;

  abstract findFirst(
    ltyProgramId: number,
    organizationId: number,
    status: LTYProgramRequestStatus,
  ): Promise<any>;

  abstract findFirstById(
    id: number,
    status: LTYProgramRequestStatus,
  ): Promise<any>;

  abstract findById(id: number): Promise<any>;

  abstract update(
    id: number,
    data: {
      status: LTYProgramRequestStatus;
      reviewedAt?: Date;
      approvedAt?: Date;
      reviewedBy?: number;
      responseComment?: string;
      rejectionReason?: string;
    },
  ): Promise<any>;

  abstract count(where: any): Promise<number>;

  abstract findManyWithPagination(filter: LoyaltyParticipantRequestsFilterDto): Promise<LoyaltyParticipantRequestsListResponseDto>;
}
