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
    // TODO: Implement corporate clients filtering logic
    // This is a placeholder implementation

    console.log('Я здесь: ');

    const page = data.page || 1;
    const size = data.size || 15;
    const skip = (page - 1) * size;

    // Placeholder data - replace with actual repository calls
    const total = 0;
    const corporates: any[] = [];

    const totalPages = Math.ceil(total / size);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: corporates.map((corporate) => this.mapToResponse(corporate)),
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
      dateRegistered: corporate.createdAt?.toISOString() || '',
    };
  }
}
