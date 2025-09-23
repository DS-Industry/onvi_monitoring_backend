import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { ILoyaltyProgramParticipantRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-participant-request';
import { LTYProgramRequestStatus } from '@prisma/client';
import { LoyaltyParticipantRequestsFilterDto } from '@platform-user/core-controller/dto/receive/loyalty-participant-requests-filter.dto';
import { LoyaltyParticipantRequestsListResponseDto, LoyaltyParticipantRequestsResponseDto } from '@platform-user/core-controller/dto/response/loyalty-participant-requests-response.dto';

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

  async findById(id: number): Promise<any> {
    return this.prisma.lTYProgramParticipantRequest.findUnique({
      where: { id },
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

  async findManyWithPagination(
    filter: LoyaltyParticipantRequestsFilterDto,
  ): Promise<LoyaltyParticipantRequestsListResponseDto> {
    const {
      page = 1,
      size = 10,
      status,
      search,
      organizationId,
      ltyProgramId,
      dateFrom,
      dateTo,
    } = filter;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (organizationId) {
      where.organizationId = organizationId;
    }

    if (ltyProgramId) {
      where.ltyProgramId = ltyProgramId;
    }

    if (dateFrom || dateTo) {
      where.requestedAt = {};
      if (dateFrom) {
        where.requestedAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.requestedAt.lte = new Date(dateTo);
      }
    }

    if (search) {
      where.OR = [
        {
          ltyProgram: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          organization: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const totalCount = await this.count(where);
    const skip = (page - 1) * size;
    const totalPages = Math.ceil(totalCount / size);

    const requests = await this.prisma.lTYProgramParticipantRequest.findMany({
      where,
      skip,
      take: size,
      orderBy: {
        requestedAt: 'desc',
      },
      include: {
        ltyProgram: {
          select: {
            id: true,
            name: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const data: LoyaltyParticipantRequestsResponseDto[] = requests.map((request) => ({
      id: request.id,
      ltyProgramId: request.ltyProgramId,
      ltyProgramName: request.ltyProgram.name,
      organizationId: request.organizationId,
      organizationName: request.organization.name,
      status: request.status,
      requestedAt: request.requestedAt,
      reviewedAt: request.reviewedAt,
      approvedAt: request.approvedAt,
      reviewedBy: request.reviewedBy,
      reviewerName: request.reviewer?.name,
      requestComment: request.requestComment,
      responseComment: request.responseComment,
      rejectionReason: request.rejectionReason,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }));

    return {
      data,
      totalCount,
      page,
      size,
      totalPages,
    };
  }

  async count(where: any): Promise<number> {
    return this.prisma.lTYProgramParticipantRequest.count({ where });
  }
}
