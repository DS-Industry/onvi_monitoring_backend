import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { MarketingCampaignActionType } from '@loyalty/marketing-campaign/domain/enums/marketing-campaign-action-type.enum';
import { actionPayloadSchemas } from '@loyalty/marketing-campaign/domain/schemas/action-payload.schema';

export class MarketingCampaignActionUpdateDto {
  @IsEnum(MarketingCampaignActionType)
  @IsOptional()
  actionType?: MarketingCampaignActionType;

  @IsObject()
  @IsOptional()
  payload?: any;

  static validatePayload(
    actionType: MarketingCampaignActionType,
    payload?: any,
  ): any {
    if (!payload) {
      return payload;
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
