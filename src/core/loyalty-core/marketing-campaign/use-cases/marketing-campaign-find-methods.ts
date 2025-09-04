import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class FindMethodsMarketingCampaignUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getOneById(id: number) {
    const campaign = await this.prisma.marketingCampaign.findUnique({
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

    if (!campaign) {
      return null;
    }

    const posCount = campaign.poses.length;
    const promocode = campaign.promocodes[0]; 

    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      type: campaign.type,
      launchDate: campaign.launchDate.toISOString(),
      endDate: campaign.endDate?.toISOString(),
      description: campaign.description,
      ltyProgramId: campaign.ltyProgramId,
      ltyProgramName: campaign.ltyProgram?.name,
      discountType: promocode?.discountType || '',
      discountValue: promocode?.discountValue || 0,
      promocode: promocode?.promocode,
      maxUsage: promocode?.maxUsage,
      currentUsage: promocode?.currentUsage || 0,
      posCount: posCount,
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString(),
      createdBy: {
        id: campaign.createdBy.id,
        name: campaign.createdBy.name,
      },
      updatedBy: {
        id: campaign.updatedBy.id,
        name: campaign.updatedBy.name,
      },
    };
  }

  async getAll() {
    const campaigns = await this.prisma.marketingCampaign.findMany({
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

    return campaigns.map(campaign => {
      const posCount = campaign.poses.length;
      const promocode = campaign.promocodes[0];

      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        type: campaign.type,
        launchDate: campaign.launchDate.toISOString(),
        endDate: campaign.endDate?.toISOString(),
        description: campaign.description,
        ltyProgramId: campaign.ltyProgramId,
        ltyProgramName: campaign.ltyProgram?.name,
        discountType: promocode?.discountType || '',
        discountValue: promocode?.discountValue || 0,
        promocode: promocode?.promocode,
        maxUsage: promocode?.maxUsage,
        currentUsage: promocode?.currentUsage || 0,
        posCount: posCount,
        createdAt: campaign.createdAt.toISOString(),
        updatedAt: campaign.updatedAt.toISOString(),
        createdBy: {
          id: campaign.createdBy.id,
          name: campaign.createdBy.name,
        },
        updatedBy: {
          id: campaign.updatedBy.id,
          name: campaign.updatedBy.name,
        },
      };
    });
  }
}

