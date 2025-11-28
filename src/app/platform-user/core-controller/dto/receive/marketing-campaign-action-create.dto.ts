import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
import { MarketingCampaignActionType } from '@loyalty/marketing-campaign/domain/enums/marketing-campaign-action-type.enum';
import {
  actionPayloadSchemas,
  getEmptyPayloadForActionType,
} from '@loyalty/marketing-campaign/domain/schemas/action-payload.schema';

export class MarketingCampaignActionCreateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Campaign ID is required' })
  campaignId: number;

  @IsEnum(MarketingCampaignActionType)
  @IsNotEmpty({ message: 'Action type is required' })
  actionType: MarketingCampaignActionType;

  @IsObject()
  @IsOptional()
  payload?: any;

  static validateAndSetDefaultPayload(
    actionType: MarketingCampaignActionType,
    payload?: any,
  ): any {
    if (!payload || Object.keys(payload).length === 0) {
      return getEmptyPayloadForActionType();
    }

    const schema = actionPayloadSchemas[actionType];
    if (schema) {
      const result = schema.safeParse(payload);
      if (!result.success) {
        throw new Error(
          `Invalid payload for action type ${actionType}: ${result.error.message}`,
        );
      }
      return result.data;
    }

    return payload;
  }
}
