import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { CorporateClientsFilterDto } from '../../../../../app/platform-user/core-controller/dto/receive/corporate-clients-filter.dto';
import { CorporateClientsPaginatedResponseDto } from '../../../../../app/platform-user/core-controller/dto/response/corporate-clients-paginated-response.dto';
import { CorporateClientResponseDto } from '../../../../../app/platform-user/core-controller/dto/response/corporate-client-response.dto';

@Injectable()
export class CorporateFindByFilterUseCase {
  constructor(private readonly corporateRepository: ICorporateRepository) {}

  async execute(
    data: CorporateClientsFilterDto,
  ): Promise<CorporateClientsPaginatedResponseDto> {
    let placementId: number | undefined = undefined;
    
    if (data.placementId !== null && data.placementId !== undefined) {
      placementId = Number(data.placementId);
      if (isNaN(placementId)) {
        placementId = undefined;
      }
    }

    const page = data.page || 1;
    const size = data.size || 15;
    const skip = size * (page - 1);
    const take = size;

    const total = await this.corporateRepository.countByFilter(
      placementId,
      data.search,
      data.inn,
      data.ownerPhone,
      data.name,
      data.registrationFrom,
      data.registrationTo,
    );

    const corporates = await this.corporateRepository.findAllByFilter(
      placementId,
      data.search,
      data.inn,
      data.ownerPhone,
      data.name,
      skip,
      take,
      data.registrationFrom,
      data.registrationTo,
    );

    
    const corporateData = corporates.map(corporate => this.mapToResponse(corporate));

    
    const totalPages = size > 0 ? Math.ceil(total / size) : 1;
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: corporateData,
      total,
      page,
      size,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  private mapToResponse(corporate: any): CorporateClientResponseDto {
    return {
      id: corporate.id,
      name: corporate.name,
      inn: corporate.inn,
      address: corporate.address,
      ownerPhone: corporate.ownerPhone || '',
      ownerName: corporate.ownerName || '',
      ownerEmail: corporate.ownerEmail || '',
      ownerAvatar: corporate.ownerAvatar || '',
      status: corporate.status || '',
      dateRegistered: corporate.createdAt?.toISOString() || '',
    };
  }
}
