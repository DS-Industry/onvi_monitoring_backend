import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramParticipantRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-participant-request';
import { LTYProgramRequestStatus } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class LoyaltyProgramParticipantRejectUseCase {
  constructor(
    private readonly participantRequestRepository: ILoyaltyProgramParticipantRequestRepository,
  ) {}

  async execute(requestId: number, user: User, comment?: string): Promise<any> {
    const participantRequest =
      await this.participantRequestRepository.findFirstById(
        requestId,
        LTYProgramRequestStatus.PENDING,
      );

    if (!participantRequest) {
      throw new Error('No pending participant request found with this ID');
    }

    const updatedRequest = await this.participantRequestRepository.update(
      participantRequest.id,
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
