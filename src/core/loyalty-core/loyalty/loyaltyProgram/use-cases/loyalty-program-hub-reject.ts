import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramHubRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-hub-request';
import { LTYProgramRequestStatus } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class LoyaltyProgramHubRejectUseCase {
  constructor(
    private readonly hubRequestRepository: ILoyaltyProgramHubRequestRepository,
  ) {}

  async execute(requestId: number, user: User, comment?: string): Promise<any> {
    const hubRequest = await this.hubRequestRepository.findFirst(
      requestId,
      LTYProgramRequestStatus.PENDING,
    );

    if (!hubRequest) {
      throw new Error('No pending hub request found with this ID');
    }

    const updatedRequest = await this.hubRequestRepository.update(
      hubRequest.id,
      {
        status: LTYProgramRequestStatus.REJECTED,
        reviewedAt: new Date(),
        reviewedBy: user.id,
        responseComment: comment,
        rejectionReason: comment,
      },
    );

    return updatedRequest;
  }
}
