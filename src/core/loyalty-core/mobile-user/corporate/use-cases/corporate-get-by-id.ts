import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { CorporateClientResponseDto } from '../../../../../app/platform-user/core-controller/dto/response/corporate-client-response.dto';

@Injectable()
export class CorporateGetByIdUseCase {
  constructor(private readonly corporateRepository: ICorporateRepository) {}

  async execute(id: number): Promise<CorporateClientResponseDto> {
    const corporate = await this.corporateRepository.findOneById(id);
    
    if (!corporate) {
      throw new Error('Corporate client not exists');
    }

    return this.mapToResponse(corporate);
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
