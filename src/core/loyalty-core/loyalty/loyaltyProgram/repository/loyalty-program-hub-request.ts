import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { ILoyaltyProgramHubRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-hub-request';
import { LTYProgramRequestStatus } from '@prisma/client';
import { LoyaltyHubRequestsFilterDto } from '@platform-user/core-controller/dto/receive/loyalty-hub-requests-filter.dto';
import {
  LoyaltyHubRequestsListResponseDto,
  LoyaltyHubRequestsResponseDto,
} from '@platform-user/core-controller/dto/response/loyalty-hub-requests-response.dto';

@Injectable()
export class LoyaltyProgramHubRequestRepository extends ILoyaltyProgramHubRequestRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(
    ltyProgramId: number,
    status: LTYProgramRequestStatus,
    requestComment?: string,
  ): Promise<any> {
    return this.prisma.lTYProgramHubRequest.create({
      data: {
        ltyProgramId,
        status,
        requestComment,
        requestedAt: new Date(),
      },
    });
  }

  async findFirst(
    ltyProgramId: number,
    status: LTYProgramRequestStatus,
  ): Promise<any> {
    return this.prisma.lTYProgramHubRequest.findFirst({
      where: {
        ltyProgramId,
        status,
      },
    });
  }

  async findFirstById(
    id: number,
    status: LTYProgramRequestStatus,
  ): Promise<any> {
    return this.prisma.lTYProgramHubRequest.findFirst({
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
    return this.prisma.lTYProgramHubRequest.update({
      where: { id },
      data,
    });
  }

  async findManyWithPagination(
    filter: LoyaltyHubRequestsFilterDto,
  ): Promise<LoyaltyHubRequestsListResponseDto> {
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
      where.ltyProgram = {
        ownerOrganizationId: organizationId,
      };
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
      where.ltyProgram = {
        ...where.ltyProgram,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    const totalCount = await this.count(where);
    const skip = (page - 1) * size;
    const totalPages = Math.ceil(totalCount / size);

    const requests = await this.prisma.lTYProgramHubRequest.findMany({
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
            ownerOrganization: {
              select: {
                id: true,
                name: true,
              },
            },
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

    const data: LoyaltyHubRequestsResponseDto[] = requests.map((request) => ({
      id: request.id,
      ltyProgramId: request.ltyProgramId,
      ltyProgramName: request.ltyProgram.name,
      organizationId: request.ltyProgram.ownerOrganization?.id,
      organizationName: request.ltyProgram.ownerOrganization?.name,
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
    return this.prisma.lTYProgramHubRequest.count({ where });
  }
}
