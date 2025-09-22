import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { LTYProgramRequestStatus } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class LoyaltyProgramHubRequestUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    loyaltyProgramId: number,
    user: User,
    comment?: string,
  ): Promise<any> {
    const loyaltyProgram = await this.prisma.lTYProgram.findFirst({
      where: {
        id: loyaltyProgramId,
      },
    });

    if (!loyaltyProgram) {
      throw new Error('Loyalty program not found or access denied');
    }

    if (loyaltyProgram.isHub) {
      throw new Error('Loyalty program is already a hub');
    }

    const existingRequest = await this.prisma.lTYProgramParticipantRequest.findFirst({
      where: {
        ltyProgramId: loyaltyProgramId,
        status: LTYProgramRequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new Error('Hub request already exists and is pending');
    }

    const hubRequest = await this.prisma.lTYProgramParticipantRequest.create({
      data: {
        ltyProgramId: loyaltyProgramId,
        organizationId: loyaltyProgram.ownerOrganizationId,
        status: LTYProgramRequestStatus.PENDING,
        requestComment: comment,
        requestedAt: new Date(),
      },
    });

    return hubRequest;
  }
}
