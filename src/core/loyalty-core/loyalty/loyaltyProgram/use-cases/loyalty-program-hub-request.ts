import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { LTYProgramRequestStatus } from '@prisma/client';

@Injectable()
export class LoyaltyProgramHubRequestUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    loyaltyProgramId: number,
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

    const existingRequest = await this.prisma.lTYProgramHubRequest.findFirst({
      where: {
        ltyProgramId: loyaltyProgramId,
        status: LTYProgramRequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new Error('Hub request already exists and is pending');
    }

    const hubRequest = await this.prisma.lTYProgramHubRequest.create({
      data: {
        ltyProgramId: loyaltyProgramId,
        status: LTYProgramRequestStatus.PENDING,
        requestComment: comment,
        requestedAt: new Date(),
      },
    });

    return hubRequest;
  }
}
