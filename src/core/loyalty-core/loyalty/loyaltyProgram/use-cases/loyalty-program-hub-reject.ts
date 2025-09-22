import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { LTYProgramRequestStatus } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class LoyaltyProgramHubRejectUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    requestId: number,
    user: User,
    comment?: string,
  ): Promise<any> {
    // Find the hub request
    const hubRequest = await this.prisma.lTYProgramParticipantRequest.findFirst({
      where: {
        id: requestId,
        status: LTYProgramRequestStatus.PENDING,
      },
    });

    if (!hubRequest) {
      throw new Error('No pending hub request found with this ID');
    }

    // Update the request status to rejected
    const updatedRequest = await this.prisma.lTYProgramParticipantRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: LTYProgramRequestStatus.REJECTED,
        reviewedAt: new Date(),
        reviewedBy: user.id,
        responseComment: comment,
        rejectionReason: comment,
      },
    });

    return updatedRequest;
  }
}
