import { LTYProgramRequestStatus } from '@prisma/client';
import { LoyaltyHubRequestsFilterDto } from '@platform-user/core-controller/dto/receive/loyalty-hub-requests-filter.dto';
import { LoyaltyHubRequestsListResponseDto } from '@platform-user/core-controller/dto/response/loyalty-hub-requests-response.dto';

export abstract class ILoyaltyProgramHubRequestRepository {
  abstract create(
    ltyProgramId: number,
    status: LTYProgramRequestStatus,
    requestComment?: string,
  ): Promise<any>;

  abstract findFirst(
    ltyProgramId: number,
    status: LTYProgramRequestStatus,
  ): Promise<any>;

  abstract findFirstById(
    id: number,
    status: LTYProgramRequestStatus,
  ): Promise<any>;

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

  abstract findManyWithPagination(
    filter: LoyaltyHubRequestsFilterDto,
  ): Promise<LoyaltyHubRequestsListResponseDto>;

  abstract count(where: any): Promise<number>;
}
