import { Client } from '@mobile-user/client/domain/client';

export abstract class IClientRepository {
  abstract create(input: Client): Promise<Client>;
  abstract createMany(input: Client[]): Promise<Client[]>;
  abstract findOneById(id: number): Promise<Client>;
  abstract findOneByPhone(phone: string): Promise<Client>;
  abstract findAll(): Promise<Client[]>;
  abstract update(id: number, input: Client): Promise<Client>;
  abstract remove(id: number): Promise<any>;
}
