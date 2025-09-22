import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { LoyaltyRequestsFilterDto } from '@platform-user/core-controller/dto/receive/loyalty-requests-filter.dto';
import { LoyaltyRequestsListResponseDto, LoyaltyRequestsResponseDto } from '@platform-user/core-controller/dto/response/loyalty-requests-response.dto';

@Injectable()
export class FindLoyaltyRequestsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(filter: LoyaltyRequestsFilterDto): Promise<LoyaltyRequestsListResponseDto> {
    const {
      page = 1,
      size = 10,
      status,
      search,
      organizationId,
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

    const totalCount = await this.prisma.lTYProgramParticipantRequest.count({
      where,
    });

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

    const data: LoyaltyRequestsResponseDto[] = requests.map((request) => ({
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
}
