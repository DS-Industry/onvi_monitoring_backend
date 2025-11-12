import { Injectable } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { MarketingCampaignCreateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-create.dto';
import { MarketingCampaignUpdateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-update.dto';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';
import { MarketingCampaignsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaigns-paginated-response.dto';
import { MarketingCampaignsFilterDto } from '@platform-user/core-controller/dto/receive/marketing-campaigns-filter.dto';
import { MarketingCampaignConditionsResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-condition-response.dto';
import { MarketingCampaignConditionResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-condition-response.dto';
import { CreateMarketingCampaignConditionDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-condition-create.dto';
import { UpsertMarketingCampaignMobileDisplayDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-mobile-display-upsert.dto';
import { MarketingCampaignMobileDisplayResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-mobile-display-response.dto';
import { PrismaService } from '@db/prisma/prisma.service';
import { MarketingCampaignStatus } from '@prisma/client';
import { MarketingCampaignMobileDisplayType } from '@loyalty/marketing-campaign/domain';
import { MarketingCampaignActionCreateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-action-create.dto';
import { MarketingCampaignActionUpdateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-action-update.dto';
import { campaignConditionTreeSchema } from '@loyalty/marketing-campaign/domain/schemas/condition-tree.schema';
import { CampaignConditionType } from '@loyalty/marketing-campaign/domain/enums/condition-type.enum';

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
        status: MarketingCampaignStatus.DRAFT,
        launchDate: data.launchDate,
        endDate: data.endDate,
        description: data.description,
        ltyProgramId: data.ltyProgramId,
        createdById: userId,
        updatedById: userId,
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
        action: true,
      },
    });

    const poses = await this.prisma.pos.findMany({
      where: {
        organization: {
          id: data.ltyProgramParticipantId,
        },
      },
      select: {
        id: true,
      },
    });

    const posCount = poses.length;
    const posIds = poses.map((pos) => pos.id);

    await this.prisma.marketingCampaign.update({
      where: { id: campaign.id },
      data: {
        poses: {
          connect: posIds.map((posId) => ({ id: posId })),
        },
      },
    });

    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      executionType: campaign.executionType,
      launchDate: campaign.launchDate.toISOString(),
      endDate: campaign.endDate?.toISOString(),
      description: campaign.description,
      ltyProgramId: campaign.ltyProgramId,
      ltyProgramName: campaign.ltyProgram?.name,
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
      actionType: campaign.action?.actionType,
      actionPayload: campaign.action?.payload as any,
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
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.ltyProgramId !== undefined)
      updateData.ltyProgramId = data.ltyProgramId;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.executionType !== undefined)
      updateData.executionType = data.executionType;

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
        action: true,
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
            connect: data.posIds.map((posId) => ({ id: posId })),
          },
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
    const posIds = poses.map((pos) => pos.id);

    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      executionType: campaign.executionType,
      launchDate: campaign.launchDate.toISOString(),
      endDate: campaign.endDate?.toISOString(),
      description: campaign.description,
      ltyProgramId: campaign.ltyProgramId,
      ltyProgramName: campaign.ltyProgram?.name,
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
      actionType: campaign.action?.actionType,
      actionPayload: campaign.action?.payload as any,
    };
  }

  async findOneById(id: number): Promise<MarketingCampaignResponseDto | null> {
    const campaign = await this.prisma.marketingCampaign.findUnique({
      where: { id },
      include: {
        action: true,
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
    const posIds = campaign.poses.map((pos) => pos.id);

    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      executionType: campaign.executionType,
      launchDate: campaign.launchDate.toISOString(),
      endDate: campaign.endDate?.toISOString(),
      description: campaign.description,
      ltyProgramId: campaign.ltyProgramId,
      ltyProgramName: campaign.ltyProgram?.name,
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
      actionType: campaign.action?.actionType,
      actionPayload: campaign.action?.payload as any,
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
        action: true,
      },
    });

    return campaigns.map((campaign) => {
      const posCount = campaign.poses.length;
      const posIds = campaign.poses.map((pos) => pos.id);

      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        executionType: campaign.executionType,
        launchDate: campaign.launchDate.toISOString(),
        endDate: campaign.endDate?.toISOString(),
        description: campaign.description,
        ltyProgramId: campaign.ltyProgramId,
        ltyProgramName: campaign.ltyProgram?.name,
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
        actionType: campaign.action?.actionType,
        actionPayload: campaign.action?.payload as any,
      };
    });
  }

  async findAllByOrganizationId(
    organizationId: number,
  ): Promise<MarketingCampaignResponseDto[]> {
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
        action: true,
      },
    });

    return campaigns.map((campaign) => {
      const posCount = campaign.poses.length;
      const posIds = campaign.poses.map((pos) => pos.id);
      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        executionType: campaign.executionType,
        launchDate: campaign.launchDate.toISOString(),
        endDate: campaign.endDate?.toISOString(),
        description: campaign.description,
        ltyProgramId: campaign.ltyProgramId,
        ltyProgramName: campaign.ltyProgram?.name,
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
        actionType: campaign.action?.actionType,
        actionPayload: campaign.action?.payload as any,
      };
    });
  }

  async findAllByOrganizationIdPaginated(
    filter: MarketingCampaignsFilterDto,
  ): Promise<MarketingCampaignsPaginatedResponseDto> {
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
        action: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const data = campaigns.map((campaign) => {
      const posCount = campaign.poses.length;
      const posIds = campaign.poses.map((pos) => pos.id);
      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        executionType: campaign.executionType,
        launchDate: campaign.launchDate.toISOString(),
        endDate: campaign.endDate?.toISOString(),
        description: campaign.description,
        ltyProgramId: campaign.ltyProgramId,
        ltyProgramName: campaign.ltyProgram?.name,
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
        actionType: campaign.action?.actionType,
        actionPayload: campaign.action?.payload as any,
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

  async findDraftCampaignsToActivate(
    now: Date,
  ): Promise<{ id: number; name: string; launchDate: Date }[]> {
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

  async findActiveCampaignsToComplete(
    now: Date,
  ): Promise<{ id: number; name: string; endDate: Date | null }[]> {
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

  async updateStatus(
    id: number,
    status: MarketingCampaignStatus,
  ): Promise<void> {
    await this.prisma.marketingCampaign.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }

  async findActiveCampaignsForClient(
    clientId: number,
    regionCode?: string | null,
  ): Promise<any[]> {
    const campaigns = await this.prisma.marketingCampaign.findMany({
      where: {
        status: 'ACTIVE',
        launchDate: {
          lte: new Date(),
        },
        OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
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

  async findConditionsByCampaignId(
    campaignId: number,
  ): Promise<MarketingCampaignConditionsResponseDto | null> {
    // Verify campaign exists
    const campaign = await this.prisma.marketingCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return null;
    }

    // Find condition record for this campaign
    const conditionRecord =
      await this.prisma.marketingCampaignCondition.findFirst({
        where: { campaignId },
      });

    if (!conditionRecord || !conditionRecord.tree) {
      return {
        campaignId,
        conditions: [],
      };
    }

    // Parse the tree
    const tree: any[] = Array.isArray(conditionRecord.tree)
      ? conditionRecord.tree
      : [];

    // Convert each condition in tree to response format
    const conditions: MarketingCampaignConditionResponseDto[] =
      await Promise.all(
        tree.map(async (treeCondition, index) => {
          const condition: MarketingCampaignConditionResponseDto = {
            id: conditionRecord.id,
            type: treeCondition.type as any,
            order: index,
          };

          // Map tree format to response format based on condition type
          switch (treeCondition.type) {
            case 'TIME_RANGE':
              if (treeCondition.start && treeCondition.end) {
                const [startHours, startMinutes] =
                  treeCondition.start.split(':');
                const [endHours, endMinutes] = treeCondition.end.split(':');
                const startDate = new Date();
                startDate.setHours(
                  parseInt(startHours),
                  parseInt(startMinutes),
                  0,
                  0,
                );
                const endDate = new Date();
                endDate.setHours(
                  parseInt(endHours),
                  parseInt(endMinutes),
                  0,
                  0,
                );
                condition.startTime = startDate.toISOString();
                condition.endTime = endDate.toISOString();
              }
              break;

            case 'WEEKDAY':
              if (treeCondition.values) {
                condition.weekdays = treeCondition.values;
              }
              break;

            case 'VISIT_COUNT':
              if (treeCondition.value !== undefined) {
                condition.visitCount = treeCondition.value;
              }
              break;

            case 'PURCHASE_AMOUNT':
              if (treeCondition.value !== undefined) {
                if (treeCondition.operator === '>=') {
                  condition.minAmount = treeCondition.value;
                } else if (treeCondition.operator === '<=') {
                  condition.maxAmount = treeCondition.value;
                }
              }
              break;

            case 'PROMOCODE_ENTRY':
              if (treeCondition.code) {
                // Find promocode by code
                const promocode = await this.prisma.lTYPromocode.findFirst({
                  where: { code: treeCondition.code },
                  select: { id: true, code: true },
                });
                if (promocode) {
                  condition.promocodeId = promocode.id;
                  condition.promocode = {
                    id: promocode.id,
                    code: promocode.code,
                  };
                }
              }
              break;

            case 'EVENT':
              if (treeCondition.benefitId) {
                condition.benefitId = treeCondition.benefitId;
                // Fetch benefit details
                const benefit = await this.prisma.lTYBenefit.findUnique({
                  where: { id: treeCondition.benefitId },
                  select: { id: true, name: true },
                });
                if (benefit) {
                  condition.benefit = {
                    id: benefit.id,
                    name: benefit.name,
                  };
                }
              }
              break;
          }

          return condition;
        }),
      );

    return {
      campaignId,
      conditions,
    };
  }

  async createCondition(
    campaignId: number,
    data: CreateMarketingCampaignConditionDto,
  ): Promise<MarketingCampaignConditionResponseDto> {
    // Verify campaign exists
    const campaign = await this.prisma.marketingCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new Error('Marketing campaign not found');
    }

    // Get existing condition record for this campaign
    const existingCondition =
      await this.prisma.marketingCampaignCondition.findFirst({
        where: { campaignId },
      });

    // Parse existing tree or create empty array
    let existingTree: any[] = [];
    if (existingCondition?.tree) {
      existingTree = Array.isArray(existingCondition.tree)
        ? existingCondition.tree
        : [];
    }

    // Convert DTO to tree format
    const newCondition: any = {
      type: data.type,
    };

    // Handle different condition types
    switch (data.type) {
      case 'TIME_RANGE':
        if (data.startTime && data.endTime) {
          // Convert Date to HH:mm format
          const startHours = data.startTime
            .getHours()
            .toString()
            .padStart(2, '0');
          const startMinutes = data.startTime
            .getMinutes()
            .toString()
            .padStart(2, '0');
          const endHours = data.endTime.getHours().toString().padStart(2, '0');
          const endMinutes = data.endTime
            .getMinutes()
            .toString()
            .padStart(2, '0');
          newCondition.start = `${startHours}:${startMinutes}`;
          newCondition.end = `${endHours}:${endMinutes}`;
        }
        break;

      case 'WEEKDAY':
        if (data.weekdays && data.weekdays.length > 0) {
          newCondition.values = data.weekdays;
        }
        break;

      case 'VISIT_COUNT':
        if (data.visitCount !== undefined) {
          // Default to GREATER_THAN_OR_EQUAL if operator not provided
          newCondition.operator = '>=' as any;
          newCondition.value = data.visitCount;
        }
        break;

      case 'PURCHASE_AMOUNT':
        if (data.minAmount !== undefined) {
          newCondition.operator = '>=' as any;
          newCondition.value = data.minAmount;
        } else if (data.maxAmount !== undefined) {
          newCondition.operator = '<=' as any;
          newCondition.value = data.maxAmount;
        }
        break;

      case 'PROMOCODE_ENTRY':
        if (data.promocodeId) {
          // Fetch promocode to get the code
          const promocode = await this.prisma.lTYPromocode.findUnique({
            where: { id: data.promocodeId },
            select: { code: true },
          });
          if (promocode) {
            newCondition.code = promocode.code;
          } else {
            throw new Error(`Promocode with id ${data.promocodeId} not found`);
          }
        }
        break;

      case 'EVENT':
        // EVENT type is not in the tree schema, but we'll store it
        if (data.benefitId) {
          newCondition.benefitId = data.benefitId;
        }
        break;
    }

    // Add new condition to tree
    existingTree.push(newCondition);

    // Validate the tree using zod schema (skip validation for EVENT type as it's not in the schema)
    const conditionsToValidate = existingTree.filter(
      (c) =>
        c.type !== 'EVENT' &&
        c.type !== CampaignConditionType.BIRTHDAY &&
        c.type !== CampaignConditionType.INACTIVITY,
    );

    if (conditionsToValidate.length > 0) {
      const validationResult =
        campaignConditionTreeSchema.safeParse(conditionsToValidate);

      if (!validationResult.success) {
        throw new Error(
          `Invalid condition tree: ${validationResult.error.errors.map((e) => e.message).join(', ')}`,
        );
      }
    }

    // Update or create condition record
    let finalCondition;
    if (existingCondition) {
      finalCondition = await this.prisma.marketingCampaignCondition.update({
        where: { id: existingCondition.id },
        data: {
          tree: existingTree,
        },
      });
    } else {
      finalCondition = await this.prisma.marketingCampaignCondition.create({
        data: {
          campaignId,
          tree: existingTree,
        },
      });
    }

    // Convert tree condition back to response format
    const treeCondition = existingTree[existingTree.length - 1];
    const response: MarketingCampaignConditionResponseDto = {
      id: finalCondition.id,
      type: data.type as any,
      order: data.order ?? existingTree.length - 1,
    };

    // Map tree format back to response format
    if (treeCondition.type === 'TIME_RANGE') {
      // Parse HH:mm back to Date (using today's date as base)
      if (treeCondition.start && treeCondition.end) {
        const [startHours, startMinutes] = treeCondition.start.split(':');
        const [endHours, endMinutes] = treeCondition.end.split(':');
        const startDate = new Date();
        startDate.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
        const endDate = new Date();
        endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
        response.startTime = startDate.toISOString();
        response.endTime = endDate.toISOString();
      }
    } else if (treeCondition.type === 'WEEKDAY') {
      response.weekdays = treeCondition.values;
    } else if (treeCondition.type === 'VISIT_COUNT') {
      response.visitCount = treeCondition.value;
    } else if (treeCondition.type === 'PURCHASE_AMOUNT') {
      if (treeCondition.operator === '>=') {
        response.minAmount = treeCondition.value;
      } else if (treeCondition.operator === '<=') {
        response.maxAmount = treeCondition.value;
      }
    } else if (treeCondition.type === 'PROMOCODE_ENTRY') {
      if (data.promocodeId) {
        response.promocodeId = data.promocodeId;
        // Fetch promocode details
        const promocode = await this.prisma.lTYPromocode.findUnique({
          where: { id: data.promocodeId },
          select: { id: true, code: true },
        });
        if (promocode) {
          response.promocode = {
            id: promocode.id,
            code: promocode.code,
          };
        }
      }
    } else if (treeCondition.type === 'EVENT' || data.type === 'EVENT') {
      if (data.benefitId) {
        response.benefitId = data.benefitId;
        // Fetch benefit details
        const benefit = await this.prisma.lTYBenefit.findUnique({
          where: { id: data.benefitId },
          select: { id: true, name: true },
        });
        if (benefit) {
          response.benefit = {
            id: benefit.id,
            name: benefit.name,
          };
        }
      }
    }

    return response;
  }

  async deleteCondition(/*conditionId: number*/): Promise<void> {
    // TODO: Implement this
    return null;
  }

  async findConditionById() // conditionId: number,
  : Promise<{ campaignId: number } | null> {
    // TODO: Implement this
    return null;
  }

  async upsertMobileDisplay(
    campaignId: number,
    data: UpsertMarketingCampaignMobileDisplayDto,
  ): Promise<MarketingCampaignMobileDisplayResponseDto> {
    const campaign = await this.prisma.marketingCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new Error('Marketing campaign not found');
    }

    const displayData: {
      marketingCampaignId: number;
      imageLink: string;
      type: MarketingCampaignMobileDisplayType;
      description?: string | null;
    } = {
      marketingCampaignId: campaignId,
      imageLink: data.imageLink,
      type: data.type,
      description:
        data.type === MarketingCampaignMobileDisplayType.PersonalPromocode
          ? null
          : data.description || null,
    };

    const mobileDisplay =
      await this.prisma.marketingCampaignMobileDisplay.upsert({
        where: { marketingCampaignId: campaignId },
        update: displayData,
        create: displayData,
      });

    return {
      id: mobileDisplay.id,
      marketingCampaignId: mobileDisplay.marketingCampaignId,
      imageLink: mobileDisplay.imageLink,
      description: mobileDisplay.description || undefined,
      type: mobileDisplay.type as MarketingCampaignMobileDisplayType,
      createdAt: mobileDisplay.createdAt.toISOString(),
      updatedAt: mobileDisplay.updatedAt.toISOString(),
    };
  }

  async findMobileDisplayByCampaignId(
    campaignId: number,
  ): Promise<MarketingCampaignMobileDisplayResponseDto | null> {
    const mobileDisplay =
      await this.prisma.marketingCampaignMobileDisplay.findUnique({
        where: { marketingCampaignId: campaignId },
      });

    if (!mobileDisplay) {
      return null;
    }

    return {
      id: mobileDisplay.id,
      marketingCampaignId: mobileDisplay.marketingCampaignId,
      imageLink: mobileDisplay.imageLink,
      description: mobileDisplay.description || undefined,
      type: mobileDisplay.type as MarketingCampaignMobileDisplayType,
      createdAt: mobileDisplay.createdAt.toISOString(),
      updatedAt: mobileDisplay.updatedAt.toISOString(),
    };
  }

  async createAction(data: MarketingCampaignActionCreateDto): Promise<{
    id: number;
    campaignId: number;
    actionType: string;
    payload: any;
  }> {
    const validatedPayload =
      MarketingCampaignActionCreateDto.validateAndSetDefaultPayload(
        data.actionType,
        data.payload,
      );

    const action = await this.prisma.marketingCampaignAction.create({
      data: {
        campaignId: data.campaignId,
        actionType: data.actionType,
        payload: validatedPayload,
      },
    });

    return {
      id: action.id,
      campaignId: action.campaignId,
      actionType: action.actionType,
      payload: action.payload as any,
    };
  }

  async updateAction(
    campaignId: number,
    data: MarketingCampaignActionUpdateDto,
  ): Promise<{
    id: number;
    campaignId: number;
    actionType: string;
    payload: any;
  }> {
    const existingAction = await this.prisma.marketingCampaignAction.findUnique(
      {
        where: { campaignId },
      },
    );

    if (!existingAction) {
      throw new Error(`Action not found for campaign ${campaignId}`);
    }

    const actionType = data.actionType || existingAction.actionType;
    let validatedPayload = data.payload;

    if (data.payload) {
      validatedPayload = MarketingCampaignActionUpdateDto.validatePayload(
        actionType,
        data.payload,
      );
    }

    const updateData: any = {};
    if (data.actionType) {
      updateData.actionType = data.actionType;
    }
    if (data.payload !== undefined) {
      updateData.payload = validatedPayload || existingAction.payload;
    }

    const action = await this.prisma.marketingCampaignAction.update({
      where: { campaignId },
      data: updateData,
    });

    return {
      id: action.id,
      campaignId: action.campaignId,
      actionType: action.actionType,
      payload: action.payload as any,
    };
  }

  async findActionByCampaignId(campaignId: number): Promise<{
    id: number;
    campaignId: number;
    actionType: string;
    payload: any;
  } | null> {
    const action = await this.prisma.marketingCampaignAction.findUnique({
      where: { campaignId },
    });

    if (!action) {
      return null;
    }

    return {
      id: action.id,
      campaignId: action.campaignId,
      actionType: action.actionType,
      payload: action.payload as any,
    };
  }
}
