import { Injectable } from '@nestjs/common';
import { MarketingCampaignCreateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-create.dto';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';
import { PrismaService } from '@db/prisma/prisma.service';

enum MarketingCampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Injectable()
export class CreateMarketingCampaignUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: MarketingCampaignCreateDto, userId: number): Promise<MarketingCampaignResponseDto> {
    const campaign = await this.prisma.marketingCampaign.create({
      data: {
        name: data.name,
        status: MarketingCampaignStatus.DRAFT,
        type: data.type,
        launchDate: data.launchDate,
        endDate: data.endDate,
        description: data.description,
        ltyProgramId: data.ltyProgramId,
        createdById: userId,
        updatedById: userId,
      },
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
      },
    });

    await this.prisma.marketingCampaign.update({
      where: { id: campaign.id },
      data: {
        poses: {
          connect: data.posIds.map(posId => ({ id: posId })),
        },
      },
    });

    let promocode = null;
    if (data.promocode || data.type === 'DISCOUNT') {
      promocode = await this.prisma.marketingPromocode.create({
        data: {
          campaignId: campaign.id,
          promocode: data.promocode || '',
          discountType: data.discountType,
          discountValue: data.discountValue,
          maxUsage: data.maxUsage,
        },
      });
    }

    const poses = await this.prisma.pos.findMany({
      where: {
        marketingCampaigns: {
          some: {
            id: campaign.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    const posCount = poses.length;
    const posIds = poses.map(pos => pos.id);

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
      posIds: posIds,
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
}
