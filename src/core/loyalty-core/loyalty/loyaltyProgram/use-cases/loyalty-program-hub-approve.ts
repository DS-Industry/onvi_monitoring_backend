import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { LTYProgramRequestStatus } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class LoyaltyProgramHubApproveUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    loyaltyProgramId: number,
    user: User,
    comment?: string,
  ): Promise<any> {
    const hubRequest = await this.prisma.lTYProgramHubRequest.findFirst({
      where: {
        ltyProgramId: loyaltyProgramId,
        status: LTYProgramRequestStatus.PENDING,
      },
    });

    if (!hubRequest) {
      throw new Error('No pending hub request found for this loyalty program');
    }

    const updatedRequest = await this.prisma.lTYProgramHubRequest.update({
      where: {
        id: hubRequest.id,
      },
      data: {
        status: LTYProgramRequestStatus.APPROVED,
        reviewedAt: new Date(),
        approvedAt: new Date(),
        reviewedBy: user.id,
        responseComment: comment,
      },
    });

    // Update the loyalty program to be a hub
    await this.prisma.lTYProgram.update({
      where: {
        id: loyaltyProgramId,
      },
      data: {
        isHub: true,
      },
    });

    return updatedRequest;
  }
}
