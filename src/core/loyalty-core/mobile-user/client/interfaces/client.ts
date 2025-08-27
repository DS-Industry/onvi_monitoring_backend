import { Client } from '../domain/client';
import { ContractType } from '@prisma/client';

export abstract class IClientRepository {
  abstract create(input: Client): Promise<Client>;
  abstract createMany(input: Client[]): Promise<Client[]>;
  abstract findOneById(id: number): Promise<Client>;
  abstract findOneByPhone(phone: string): Promise<Client>;
  abstract findAll(): Promise<Client[]>;
  abstract findAllByFilter(
    placementId?: number,
    tagIds?: number[],
    contractType?: ContractType,
    workerCorporateId?: number,
    organizationId?: number | null,
    phone?: string,
    skip?: number,
    take?: number,
    registrationFrom?: string,
    registrationTo?: string,
    search?: string,
  ): Promise<Client[]>;
  abstract countByFilter(
    placementId?: number,
    tagIds?: number[],
    contractType?: ContractType,
    workerCorporateId?: number,
    organizationId?: number | null,
    phone?: string,
    registrationFrom?: string,
    registrationTo?: string,
    search?: string,
  ): Promise<number>;
  abstract update(input: Client): Promise<Client>;
  abstract updateConnectionTag(
    userId: number,
    addTagIds: number[],
    deleteTagIds: number[],
  ): Promise<any>;
  abstract remove(id: number): Promise<any>;
}
