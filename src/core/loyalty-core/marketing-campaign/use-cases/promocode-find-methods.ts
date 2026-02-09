import { Injectable } from '@nestjs/common';
import { IPromoCodeRepository, PromocodeFilterType as RepoPromocodeFilterType } from '@loyalty/marketing-campaign/interface/promo-code-repository.interface';
import { PromocodesFilterDto, PromocodeFilterType } from '@platform-user/core-controller/dto/receive/personal-promocodes-filter.dto';
import { PersonalPromocodesPaginatedResponseDto } from '@platform-user/core-controller/dto/response/personal-promocodes-paginated-response.dto';
import { PersonalPromocodeResponseDto } from '@platform-user/core-controller/dto/response/personal-promocode-response.dto';

@Injectable()
export class FindMethodsPromocodeUseCase {
  constructor(
    private readonly promoCodeRepository: IPromoCodeRepository,
  ) {}

  async findAllPromocodesPaginated(
    filter: PromocodesFilterDto,
  ): Promise<PersonalPromocodesPaginatedResponseDto> {
    const filterType = filter.filter === PromocodeFilterType.PERSONAL 
      ? RepoPromocodeFilterType.PERSONAL 
      : RepoPromocodeFilterType.ALL;

    const result = await this.promoCodeRepository.findAllPromocodesPaginated({
      organizationId: filter.organizationId,
      filter: filterType,
      page: filter.page,
      size: filter.size,
      isActive: filter.isActive,
      search: filter.search,
      personalUserId: filter.personalUserId,
    });

    const data: PersonalPromocodeResponseDto[] = result.data.map((promocode) => ({
      id: promocode.id,
      campaignId: promocode.campaignId,
      code: promocode.code,
      promocodeType: promocode.promocodeType,
      personalUserId: promocode.personalUserId,
      discountType: promocode.discountType as any,
      discountValue: promocode.discountValue,
      minOrderAmount: promocode.minOrderAmount,
      maxDiscountAmount: promocode.maxDiscountAmount,
      maxUsage: promocode.maxUsage,
      maxUsagePerUser: promocode.maxUsagePerUser,
      currentUsage: promocode.currentUsage,
      validFrom: promocode.validFrom.toISOString(),
      validUntil: promocode.validUntil ? promocode.validUntil.toISOString() : null,
      isActive: promocode.isActive,
      createdByManagerId: promocode.createdByManagerId,
      createdReason: promocode.createdReason,
      organizationId: promocode.organizationId,
      posId: promocode.posId,
      placementId: promocode.placementId,
      createdAt: promocode.createdAt.toISOString(),
      updatedAt: promocode.updatedAt.toISOString(),
      personalUser: promocode.personalUser,
    }));

    return {
      data,
      total: result.total,
      page: result.page,
      size: result.size,
      totalPages: result.totalPages,
      hasNext: result.hasNext,
      hasPrevious: result.hasPrevious,
    };
  }
}
