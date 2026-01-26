import { Injectable } from '@nestjs/common';
import { PromoCodeService } from './promo-code-service';

export interface ValidatePromoCodeRequest {
  code: string;
  userId: number;
  carWashId: number;
}

export interface ValidatePromoCodeResponse {
  isValid: boolean;
  promoCodeId: number | null;
  isPersonal: boolean;
  isMarketingCampaign: boolean;
  message?: string;
}

@Injectable()
export class ValidatePromoCodeUseCase {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  async execute(
    request: ValidatePromoCodeRequest,
  ): Promise<ValidatePromoCodeResponse> {
    return await this.promoCodeService.validatePromoCode(
      request.code,
      request.userId,
      request.carWashId,
    );
  }
}
