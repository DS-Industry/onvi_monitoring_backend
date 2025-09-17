import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GetActivePromotionsUseCase {
  constructor(private readonly prisma: PrismaService, private readonly httpService: HttpService) {}

  private readonly mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;

  async execute(clientId: number, location?: { latitude: number; longitude: number }): Promise<any[]> {
    let regionCode: string | null = null;

    if (location) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.longitude},${location.latitude}.json`;
      const params = {
        access_token: this.mapboxAccessToken,
        types: 'region,country,place',
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );

      if (response.data?.features?.length > 0) {
        const features = response.data.features;
        for (const feature of features) {
          if (
            feature.place_type?.includes('region') &&
            feature.properties?.short_code
          ) {
            regionCode = feature.properties.short_code;
            break;
          }
        }
      }
    }

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
        ltyUsers: {
          some: {
            id: clientId,
          },
        },
        promocodes: {
          some: {
            isActive: true,
            ...(regionCode && {
              placement: {
                regionCode: regionCode,
              }
            })
          }
        }
      },
      include: {
        promocodes: {
          where: {
            isActive: true,
            ...(regionCode && {
              placement: {
                regionCode: regionCode,
              }
            })
          },
        },
        poses: true,
        campaignUsage: {
          where: {
            ltyUserId: clientId,
          },
        },
      },
    });

    const availableCampaigns = campaigns.filter(campaign => {
      return campaign.campaignUsage.length === 0;
    });

    return availableCampaigns;
  }
}
