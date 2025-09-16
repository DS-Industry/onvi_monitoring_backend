import { ClientMeta } from './client-meta.entity';

export interface IClientMetaRepository {
  create(meta: ClientMeta): Promise<ClientMeta>;
  findById(id: number): Promise<ClientMeta | null>;
  findByClientId(clientId: number): Promise<ClientMeta | null>;
  update(meta: ClientMeta): Promise<ClientMeta>;
  delete(id: number): Promise<void>;
}
