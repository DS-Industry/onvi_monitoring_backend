import { Injectable } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { MarketingCampaignCreateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-create.dto';
import { MarketingCampaignUpdateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-update.dto';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';
import { PrismaService } from '@db/prisma/prisma.service';
import { MarketingCampaignStatus } from '@prisma/client';

@Injectable()
export class MarketingCampaignRepository extends IMarketingCampaignRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(
    data: MarketingCampaignCreateDto,
    userId: number,
  ): Promise<MarketingCampaignResponseDto> {
    const campaign = await this.prisma.marketingCampaign.create({
      data: {
        name: data.name,
        status: data.status || MarketingCampaignStatus.DRAFT,
        type: data.type,
        launchDate: data.launchDate,
        endDate: data.endDate,
        description: data.description,
        ltyProgramId: data.ltyProgramId,
        createdById: userId,
        updatedById: userId,
        discountType: data.type === "DISCOUNT" ? data.discountType || "PERCENTAGE" : null,
        discountValue: data.type === "DISCOUNT" ? data.discountValue : null,
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
    if (data.promocode) {
      promocode = await this.prisma.marketingPromocode.create({
        data: {
          campaignId: campaign.id,
          promocode: data.promocode || '',
          discountType: data.discountType || "PERCENTAGE",
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

  async update(
    id: number,
    data: MarketingCampaignUpdateDto,
    userId: number,
  ): Promise<MarketingCampaignResponseDto> {
    const existingCampaign = await this.prisma.marketingCampaign.findUnique({
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
      },
    });

    if (!existingCampaign) {
      throw new Error('Marketing campaign not found');
    }

    const updateData: any = {
      updatedById: userId,
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.launchDate !== undefined) updateData.launchDate = data.launchDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.ltyProgramId !== undefined) updateData.ltyProgramId = data.ltyProgramId;
    if (data.status !== undefined) updateData.status = data.status;

    const campaign = await this.prisma.marketingCampaign.update({
      where: { id },
      data: updateData,
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
      },
    });

    if (data.posIds) {
      await this.prisma.marketingCampaign.update({
        where: { id },
        data: {
          poses: {
            set: [], 
          },
        },
      });

      await this.prisma.marketingCampaign.update({
        where: { id },
        data: {
          poses: {
            connect: data.posIds.map(posId => ({ id: posId })),
          },
        },
      });
    }

    let promocode = null;
    if (data.promocode || data.discountType || data.discountValue !== undefined || data.maxUsage !== undefined) {
      const existingPromocode = campaign.promocodes[0];

      if (existingPromocode) {
        const promocodeUpdateData: any = {};
        if (data.promocode !== undefined) promocodeUpdateData.promocode = data.promocode;
        if (data.discountType !== undefined) promocodeUpdateData.discountType = data.discountType;
        if (data.discountValue !== undefined) promocodeUpdateData.discountValue = data.discountValue;
        if (data.maxUsage !== undefined) promocodeUpdateData.maxUsage = data.maxUsage;

        promocode = await this.prisma.marketingPromocode.update({
          where: { id: existingPromocode.id },
          data: promocodeUpdateData,
        });
      } else if (data.promocode || data.type === 'DISCOUNT') {
        promocode = await this.prisma.marketingPromocode.create({
          data: {
            campaignId: campaign.id,
            promocode: data.promocode || '', 
            discountType: data.discountType || 'PERCENTAGE',
            discountValue: data.discountValue || 0,
            maxUsage: data.maxUsage,
          },
        });
      }
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
      discountType: promocode?.discountType || data.discountType || campaign.promocodes[0]?.discountType || '',
      discountValue: promocode?.discountValue || data.discountValue || campaign.promocodes[0]?.discountValue || 0,
      promocode: promocode?.promocode || campaign.promocodes[0]?.promocode,
      maxUsage: promocode?.maxUsage || campaign.promocodes[0]?.maxUsage,
      currentUsage: promocode?.currentUsage || campaign.promocodes[0]?.currentUsage || 0,
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

  async findOneById(id: number): Promise<MarketingCampaignResponseDto | null> {
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
    const posIds = campaign.poses.map(pos => pos.id);

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

  async findAll(): Promise<MarketingCampaignResponseDto[]> {
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
      const posIds = campaign.poses.map(pos => pos.id);

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
    });
  }

  async findDraftCampaignsToActivate(now: Date): Promise<{ id: number; name: string; launchDate: Date }[]> {
    const campaigns = await this.prisma.marketingCampaign.findMany({
      where: {
        status: MarketingCampaignStatus.DRAFT,
        launchDate: {
          lte: now,
        },
      },
      select: {
        id: true,
        name: true,
        launchDate: true,
      },
    });

    return campaigns;
  }

  async findActiveCampaignsToComplete(now: Date): Promise<{ id: number; name: string; endDate: Date | null }[]> {
    const campaigns = await this.prisma.marketingCampaign.findMany({
      where: {
        status: MarketingCampaignStatus.ACTIVE,
        endDate: {
          lte: now,
        },
      },
      select: {
        id: true,
        name: true,
        endDate: true,
      },
    });

    return campaigns;
  }

  async updateStatus(id: number, status: MarketingCampaignStatus): Promise<void> {
    await this.prisma.marketingCampaign.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }
}
