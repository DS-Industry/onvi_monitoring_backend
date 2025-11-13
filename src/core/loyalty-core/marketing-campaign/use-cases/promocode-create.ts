import { Injectable } from '@nestjs/common';
import {
  IPromoCodeRepository,
  PromoCode,
} from '../interface/promo-code-repository.interface';
import { PromocodeCreateDto } from '@platform-user/core-controller/dto/receive/promocode-create.dto';
import { PromocodeResponseDto } from '@platform-user/core-controller/dto/response/promocode-response.dto';

@Injectable()
export class CreatePromocodeUseCase {
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
    data: PromocodeCreateDto,
    createdByManagerId?: number,
  ): Promise<PromocodeResponseDto> {
    const promoCode = await this.promoCodeRepository.create({
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
      createdByManagerId,
      createdReason: data.createdReason,
      usageRestrictions: data.usageRestrictions,
      organizationId: data.organizationId,
      posId: data.posId,
      placementId: data.placementId,
    });

    return this.mapToResponseDto(promoCode);
  }
}
