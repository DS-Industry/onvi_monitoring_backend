import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class FindMethodsMarketingCampaignUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getOneById(id: number) {
    return await this.prisma.marketingCampaign.findUnique({
      where: { id },
      include: {
        ltyProgram: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        promocodes: true,
        poses: true,
      },
    });
  }

  async getAll() {
    return await this.prisma.marketingCampaign.findMany({
      include: {
        ltyProgram: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        promocodes: true,
        poses: true,
      },
    });
  }
}

