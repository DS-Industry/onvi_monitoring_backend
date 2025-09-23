import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { ILoyaltyProgramParticipantRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-participant-request';
import { LTYProgramRequestStatus } from '@prisma/client';

@Injectable()
export class LoyaltyProgramParticipantRequestRepository extends ILoyaltyProgramParticipantRequestRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(
    ltyProgramId: number,
    organizationId: number,
    status: LTYProgramRequestStatus,
    requestComment?: string,
  ): Promise<any> {
    return this.prisma.lTYProgramParticipantRequest.create({
      data: {
        ltyProgramId,
        organizationId,
        status,
        requestComment,
        requestedAt: new Date(),
      },
    });
  }

  async findFirst(
    ltyProgramId: number,
    organizationId: number,
    status: LTYProgramRequestStatus,
  ): Promise<any> {
    return this.prisma.lTYProgramParticipantRequest.findFirst({
      where: {
        ltyProgramId,
        organizationId,
        status,
      },
    });
  }

  async findFirstById(
    id: number,
    status: LTYProgramRequestStatus,
  ): Promise<any> {
    return this.prisma.lTYProgramParticipantRequest.findFirst({
      where: {
        id,
        status,
      },
    });
  }

  async update(
    id: number,
    data: {
      status: LTYProgramRequestStatus;
      reviewedAt?: Date;
      approvedAt?: Date;
      reviewedBy?: number;
      responseComment?: string;
      rejectionReason?: string;
    },
  ): Promise<any> {
    return this.prisma.lTYProgramParticipantRequest.update({
      where: { id },
      data,
    });
  }

  async count(where: any): Promise<number> {
    return this.prisma.lTYProgramParticipantRequest.count({ where });
  }
}
