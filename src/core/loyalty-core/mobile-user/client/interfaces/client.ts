import { Client } from '../domain/client';
import { UserType } from '@prisma/client';

export abstract class IClientRepository {
  abstract create(input: Client): Promise<Client>;
  abstract createMany(input: Client[]): Promise<Client[]>;
  abstract findOneById(id: number): Promise<Client>;
  abstract findOneByPhone(phone: string): Promise<Client>;
  abstract findAll(): Promise<Client[]>;
  abstract findAllByFilter(
    placementId?: number,
    tagIds?: number[],
    type?: UserType,
    phone?: string,
    skip?: number,
    take?: number,
  ): Promise<Client[]>;
  abstract update(input: Client): Promise<Client>;
  abstract updateConnectionTag(
    userId: number,
    addTagIds: number[],
    deleteTagIds: number[],
  ): Promise<any>;
  abstract remove(id: number): Promise<any>;
}
