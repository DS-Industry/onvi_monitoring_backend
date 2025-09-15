import { Client } from './client.entity';

export interface IClientRepository {
  create(client: Client): Promise<Client>;
  findById(id: number): Promise<Client | null>;
  findByPhone(phone: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  update(client: Client): Promise<Client>;
  delete(id: number): Promise<void>;
  setRefreshToken(phone: string, token: string): Promise<void>;
  findMany(filters?: {
    status?: string;
    contractType?: string;
    placementId?: number;
    limit?: number;
    offset?: number;
  }): Promise<Client[]>;
}
