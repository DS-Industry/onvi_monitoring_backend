import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramParticipantRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-participant-request';
import { LTYProgramRequestStatus } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class LoyaltyProgramParticipantApproveUseCase {
  constructor(
    private readonly participantRequestRepository: ILoyaltyProgramParticipantRequestRepository,
    private readonly prisma: PrismaService,
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
        status: LTYProgramRequestStatus.APPROVED,
        reviewedAt: new Date(),
        approvedAt: new Date(),
        reviewedBy: user.id,
        responseComment: comment,
      },
    );

    await this.prisma.lTYProgramParticipant.create({
      data: {
        ltyProgramId: participantRequest.ltyProgramId,
        organizationId: participantRequest.organizationId,
        status: 'ACTIVE',
        registeredAt: new Date(),
        requestId: participantRequest.id,
        comment: comment,
      },
    });

    return updatedRequest;
  }
}
