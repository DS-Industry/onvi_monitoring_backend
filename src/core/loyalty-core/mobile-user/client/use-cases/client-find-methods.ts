import { Injectable } from '@nestjs/common';
import { IClientRepository } from '@loyalty/mobile-user/client/interfaces/client';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { ContractType } from '@prisma/client';

@Injectable()
export class FindMethodsClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async getById(id: number): Promise<Client> {
    return await this.clientRepository.findOneById(id);
  }

  async getByPhone(phone: string): Promise<Client> {
    return await this.clientRepository.findOneByPhone(phone);
  }

  async getAllByFilter(
    placementId?: number,
    tagIds?: number[],
    type?: ContractType,
    phone?: string,
    skip?: number,
    take?: number,
  ): Promise<Client[]> {
    return await this.clientRepository.findAllByFilter(
      placementId,
      tagIds,
      type,
      phone,
      skip,
      take,
    );
  }
}
