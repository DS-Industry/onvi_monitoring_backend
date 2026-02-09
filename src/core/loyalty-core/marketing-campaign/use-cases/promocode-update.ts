import { Injectable, HttpStatus } from '@nestjs/common';
import {
  IPromoCodeRepository,
  PromoCode,
} from '../interface/promo-code-repository.interface';
import { PromocodeUpdateDto } from '@platform-user/core-controller/dto/receive/promocode-update.dto';
import { PromocodeResponseDto } from '@platform-user/core-controller/dto/response/promocode-response.dto';
import { LoyaltyException } from '@exception/option.exceptions';

@Injectable()
export class UpdatePromocodeUseCase {
  constructor(private readonly promoCodeRepository: IPromoCodeRepository) {}

  private mapToResponseDto(promoCode: PromoCode): PromocodeResponseDto {
    return {
      id: promoCode.id,
      campaignId: promoCode.campaignId,
      code: promoCode.code,
      discountType: promoCode.discountType as any,
      discountValue: promoCode.discountValue,
      minOrderAmount: promoCode.minOrderAmount,
      maxDiscountAmount: promoCode.maxDiscountAmount,
      maxUsage: promoCode.maxUsage,
      maxUsagePerUser: promoCode.maxUsagePerUser,
      currentUsage: promoCode.currentUsage,
      validFrom: promoCode.validFrom.toISOString(),
      validUntil: promoCode.validUntil?.toISOString() || null,
      isActive: promoCode.isActive,
    };
  }

  async execute(
    id: number,
    data: PromocodeUpdateDto,
  ): Promise<PromocodeResponseDto> {
    const existingPromocode = await this.promoCodeRepository.findById(id);

    if (!existingPromocode) {
      throw new LoyaltyException(
        HttpStatus.NOT_FOUND,
        'Promocode not found',
      );
    }

    if (existingPromocode.campaignId) {
      throw new LoyaltyException(
        HttpStatus.FORBIDDEN,
        'Campaign promocodes cannot be edited',
      );
    }

    const promoCode = await this.promoCodeRepository.update(id, {
      campaignId: data.campaignId,
      code: data.code,
      promocodeType: data.promocodeType,
      personalUserId: data.personalUserId,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderAmount: data.minOrderAmount,
      maxDiscountAmount: data.maxDiscountAmount,
      maxUsage: data.maxUsage,
      maxUsagePerUser: data.maxUsagePerUser,
      validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
      validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      isActive: data.isActive,
      createdReason: data.createdReason,
      usageRestrictions: data.usageRestrictions,
      organizationId: data.organizationId,
      posId: data.posId,
      placementId: data.placementId,
    });

    return this.mapToResponseDto(promoCode);
  }
}
