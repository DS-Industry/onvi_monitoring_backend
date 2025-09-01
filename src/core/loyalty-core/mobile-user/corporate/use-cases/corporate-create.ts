import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { CorporateClientCreateDto } from '@platform-user/core-controller/dto/receive/corporate-client-create.dto';
import { CorporateClientResponseDto } from '@platform-user/core-controller/dto/response/corporate-client-response.dto';
import { Corporate } from '@loyalty/mobile-user/corporate/domain/corporate';

@Injectable()
export class CreateCorporateClientUseCase {
  constructor(private readonly corporateRepository: ICorporateRepository) {}

  async execute(data: CorporateClientCreateDto, ownerId: number): Promise<CorporateClientResponseDto> {
    const corporateData = new Corporate({
      name: data.name,
      inn: data.inn,
      address: data.address,
      ownerId: ownerId,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    const corporate = await this.corporateRepository.create(corporateData);

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
      dateRegistered: corporate.createdAt.toISOString(),
    };
  }
}
