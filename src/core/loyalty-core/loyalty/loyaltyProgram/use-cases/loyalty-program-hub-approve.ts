import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramHubRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-hub-request';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { LTYProgramRequestStatus } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class LoyaltyProgramHubApproveUseCase {
  constructor(
    private readonly hubRequestRepository: ILoyaltyProgramHubRequestRepository,
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
  ) {}

  async execute(
    loyaltyProgramId: number,
    user: User,
    comment?: string,
  ): Promise<any> {
    const hubRequest = await this.hubRequestRepository.findFirst(
      loyaltyProgramId,
      LTYProgramRequestStatus.PENDING,
    );

    if (!hubRequest) {
      throw new Error('No pending hub request found for this loyalty program');
    }

    const updatedRequest = await this.hubRequestRepository.update(hubRequest.id, {
      status: LTYProgramRequestStatus.APPROVED,
      reviewedAt: new Date(),
      approvedAt: new Date(),
      reviewedBy: user.id,
      responseComment: comment,
    });

    // Update the loyalty program to be a hub
    await this.loyaltyProgramRepository.updateIsHubStatus(loyaltyProgramId, true);

    return updatedRequest;
  }
}
