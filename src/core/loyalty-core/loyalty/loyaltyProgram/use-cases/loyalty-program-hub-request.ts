import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { LTYProgramRequestStatus } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class LoyaltyProgramHubRequestUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    loyaltyProgramId: number,
    organizationId: number,
    user: User,
    comment?: string,
  ): Promise<any> {
    // Check if loyalty program exists and user has access
    const loyaltyProgram = await this.prisma.lTYProgram.findFirst({
      where: {
        id: loyaltyProgramId,
        ownerOrganizationId: organizationId,
      },
    });

    if (!loyaltyProgram) {
      throw new Error('Loyalty program not found or access denied');
    }

    // Check if already a hub
    if (loyaltyProgram.isHub) {
      throw new Error('Loyalty program is already a hub');
    }

    // Check if there's already a pending request
    const existingRequest = await this.prisma.lTYProgramParticipantRequest.findFirst({
      where: {
        ltyProgramId: loyaltyProgramId,
        organizationId: organizationId,
        status: LTYProgramRequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new Error('Hub request already exists and is pending');
    }

    // Create hub request
    const hubRequest = await this.prisma.lTYProgramParticipantRequest.create({
      data: {
        ltyProgramId: loyaltyProgramId,
        organizationId: organizationId,
        status: LTYProgramRequestStatus.PENDING,
        requestComment: comment,
        requestedAt: new Date(),
      },
    });

    return hubRequest;
  }
}
