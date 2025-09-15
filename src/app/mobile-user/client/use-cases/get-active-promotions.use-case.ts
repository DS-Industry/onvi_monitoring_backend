import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class GetActivePromotionsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(clientId: number, location?: { latitude: number; longitude: number }): Promise<any[]> {
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
