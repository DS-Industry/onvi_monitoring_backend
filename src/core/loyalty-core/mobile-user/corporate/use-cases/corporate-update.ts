import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { CorporateClientUpdateDto } from '@platform-user/core-controller/dto/receive/corporate-client-update.dto';
import { CorporateClientResponseDto } from '@platform-user/core-controller/dto/response/corporate-client-response.dto';

@Injectable()
export class UpdateCorporateClientUseCase {
  constructor(private readonly corporateRepository: ICorporateRepository) {}

  async execute(
    id: number,
    data: CorporateClientUpdateDto,
  ): Promise<CorporateClientResponseDto> {
    const existingCorporate = await this.corporateRepository.findOneById(id);

    if (!existingCorporate) {
      throw new Error(`Corporate client with id ${id} not found`);
    }

    if (data.name !== undefined) {
      existingCorporate.name = data.name;
    }
    if (data.inn !== undefined) {
      existingCorporate.inn = data.inn;
    }
    if (data.address !== undefined) {
      existingCorporate.address = data.address;
    }

    existingCorporate.updatedAt = new Date(Date.now());

    const updatedCorporate =
      await this.corporateRepository.update(existingCorporate);

    return {
      id: updatedCorporate.id,
      name: updatedCorporate.name,
      inn: updatedCorporate.inn,
      address: updatedCorporate.address,
      ownerPhone: updatedCorporate.ownerPhone || '',
      ownerName: updatedCorporate.ownerName || '',
      ownerEmail: updatedCorporate.ownerEmail || '',
      ownerAvatar: updatedCorporate.ownerAvatar || '',
      status: updatedCorporate.status || '',
      dateRegistered: updatedCorporate.createdAt.toISOString(),
    };
  }
}
