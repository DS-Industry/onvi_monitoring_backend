import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { CorporateClientResponseDto } from '../../../../../app/platform-user/core-controller/dto/response/corporate-client-response.dto';

@Injectable()
export class CorporateGetByIdUseCase {
  constructor(private readonly corporateRepository: ICorporateRepository) {}

  async execute(id: number): Promise<CorporateClientResponseDto> {
    // TODO: Implement corporate client retrieval logic
    // This is a placeholder implementation

    // Placeholder data - replace with actual repository call
    const corporate: any = {
      id,
      name: 'Placeholder Corporate',
      inn: '0000000000',
      address: 'Placeholder Address',
      ownerPhone: '+1234567890',
      status: 'ACTIVE',
      contractType: 'CORPORATE',
      comment: 'Placeholder comment',
      placementId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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
