import { Injectable } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GetActivePromotionsForClientUseCase {
  constructor(
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
    private readonly httpService: HttpService,
  ) {}

  private readonly mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;

  private async getRegionCodeFromLocation(location: {
    latitude: number;
    longitude: number;
  }): Promise<string | null> {
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
          return feature.properties.short_code;
        }
      }
    }

    return null;
  }

  async execute(
    clientId: number,
    location?: { latitude: number; longitude: number },
  ): Promise<any[]> {
    let regionCode: string | null = null;

    if (location) {
      regionCode = await this.getRegionCodeFromLocation(location);
    }

    return await this.marketingCampaignRepository.findActiveCampaignsForClient(
      clientId,
      regionCode,
    );
  }
}
