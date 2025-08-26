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
    contractType?: ContractType,
    workerCorporateId?: number,
    phone?: string,
    skip?: number,
    take?: number,
    registrationFrom?: string,
    registrationTo?: string,
    search?: string,
  ): Promise<Client[]> {
    return await this.clientRepository.findAllByFilter(
      placementId,
      tagIds,
      contractType,
      workerCorporateId,
      phone,
      skip,
      take,
      registrationFrom,
      registrationTo,
      search,
    );
  }

  async getCountByFilter(
    placementId?: number,
    tagIds?: number[],
    contractType?: ContractType,
    workerCorporateId?: number,
    phone?: string,
    registrationFrom?: string,
    registrationTo?: string,
    search?: string,
  ): Promise<number> {
    return await this.clientRepository.countByFilter(
      placementId,
      tagIds,
      contractType,
      workerCorporateId,
      phone,
      registrationFrom,
      registrationTo,
      search,
    );
  }
}
