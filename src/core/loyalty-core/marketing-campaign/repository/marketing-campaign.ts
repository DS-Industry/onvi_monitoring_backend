import { Injectable } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { MarketingCampaignCreateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-create.dto';
import { MarketingCampaignUpdateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-update.dto';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';
import { MarketingCampaignsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaigns-paginated-response.dto';
import { MarketingCampaignsFilterDto } from '@platform-user/core-controller/dto/receive/marketing-campaigns-filter.dto';
import { PrismaService } from '@db/prisma/prisma.service';
import { MarketingCampaignStatus, MarketingCampaignType } from '@prisma/client';

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
        discountType: data.type === MarketingCampaignType.DISCOUNT ? data.discountType || "PERCENTAGE" : null,
        discountValue: data.type === MarketingCampaignType.DISCOUNT ? data.discountValue : null,
        ltyProgramParticipantId: data.ltyProgramParticipantId,
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
      promocode = await this.prisma.lTYPromocode.create({
        data: {
          campaignId: campaign.id,
          code: data.promocode || '',
          promocodeType: 'CAMPAIGN',
          discountType: data.discountType === 'FIXED' ? 'FIXED_AMOUNT' : 'PERCENTAGE',
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
      discountValue: promocode?.discountValue ? Number(promocode.discountValue) : 0,
      promocode: promocode?.code,
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

    if (data.type === MarketingCampaignType.DISCOUNT) {
      if (existingCampaign.promocodes.length > 0) {
        await this.prisma.lTYPromocode.deleteMany({
          where: { campaignId: id },
        });
      }
      
      if (data.discountType !== undefined || data.discountValue !== undefined) {
        await this.prisma.marketingCampaign.update({
          where: { id },
          data: {
            discountType: data.discountType,
            discountValue: data.discountValue,
          },
        });
      }
    } else if (data.type === MarketingCampaignType.PROMOCODE) {
      if (existingCampaign.type === MarketingCampaignType.DISCOUNT) {
        await this.prisma.marketingCampaign.update({
          where: { id },
          data: {
            discountType: null,
            discountValue: null,
          },
        });
      }
      
      const existingPromocode = campaign.promocodes[0];
      if (existingPromocode) {
        const promocodeUpdateData: any = {};
        if (data.promocode !== undefined) promocodeUpdateData.code = data.promocode;
        if (data.discountType !== undefined) promocodeUpdateData.discountType = data.discountType === 'FIXED' ? 'FIXED_AMOUNT' : 'PERCENTAGE';
        if (data.discountValue !== undefined) promocodeUpdateData.discountValue = data.discountValue;
        if (data.maxUsage !== undefined) promocodeUpdateData.maxUsage = data.maxUsage;

        promocode = await this.prisma.lTYPromocode.update({
          where: { id: existingPromocode.id },
          data: promocodeUpdateData,
        });
      } else {
        promocode = await this.prisma.lTYPromocode.create({
          data: {
            campaignId: campaign.id,
            code: data.promocode || '',
            promocodeType: 'CAMPAIGN',
            discountType: data.discountType === 'FIXED' ? 'FIXED_AMOUNT' : 'PERCENTAGE',
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
      discountType: campaign.type === MarketingCampaignType.DISCOUNT 
        ? campaign.discountType || ''
        : (promocode?.discountType || campaign.promocodes[0]?.discountType || ''),
      discountValue: campaign.type === MarketingCampaignType.DISCOUNT
        ? campaign.discountValue || 0
        : (promocode?.discountValue || campaign.promocodes[0]?.discountValue || 0),
      promocode: promocode?.code || campaign.promocodes[0]?.code,
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
      discountType: promocode?.discountType || campaign.discountType || '',
      discountValue: Number(promocode?.discountValue) || Number(campaign.discountValue) || 0,
      promocode: promocode?.code,
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
        discountValue: promocode?.discountValue ? Number(promocode.discountValue) : 0,
        promocode: promocode?.code,
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

  async findAllByOrganizationId(organizationId: number): Promise<MarketingCampaignResponseDto[]> {    
    const campaigns = await this.prisma.marketingCampaign.findMany({
      where: {
        ltyProgramParticipant: {
          organizationId: organizationId,
        },
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
        discountValue: promocode?.discountValue ? Number(promocode.discountValue) : 0,
        promocode: promocode?.code,
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

  async findAllByOrganizationIdPaginated(filter: MarketingCampaignsFilterDto): Promise<MarketingCampaignsPaginatedResponseDto> {
    const { page = 1, size = 10, organizationId, status, search } = filter;
    const skip = size * (page - 1);
    const take = size;

    const where: any = {
      ltyProgramParticipant: {
        organizationId: organizationId,
      },
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.marketingCampaign.count({ where });

    const campaigns = await this.prisma.marketingCampaign.findMany({
      where,
      skip,
      take,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    const data = campaigns.map(campaign => {
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
        discountValue: promocode?.discountValue ? Number(promocode.discountValue) : 0,
        promocode: promocode?.code,
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

    const totalPages = Math.ceil(total / size);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data,
      total,
      page,
      size,
      totalPages,
      hasNext,
      hasPrevious,
    };
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

  async findActiveCampaignsForClient(clientId: number, regionCode?: string | null): Promise<any[]> {
    const campaigns = await this.prisma.marketingCampaign.findMany({
      where: {
        status: 'ACTIVE',
        launchDate: {
          lte: new Date(),
        },
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
      include: {
        promocodes: {
          where: {
            isActive: true,
            ...(regionCode && {
              placement: {
                regionCode: regionCode,
              },
            }),
          },
        },
        poses: true,
      },
    });

    const availableCampaigns = [];
    for (const campaign of campaigns) {
      const usage = await this.prisma.marketingCampaignUsage.findFirst({
        where: {
          campaignId: campaign.id,
          ltyUserId: clientId,
        },
      });

      if (!usage) {
        availableCampaigns.push(campaign);
      }
    }

    return availableCampaigns;
  }
}
