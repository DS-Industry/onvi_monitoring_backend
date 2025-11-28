import { ClientMeta } from '../domain/clientMeta';

export abstract class IClientMetaRepository {
  abstract create(input: ClientMeta): Promise<ClientMeta>;
  abstract createMany(input: ClientMeta[]): Promise<ClientMeta[]>;
  abstract findOneById(id: number): Promise<ClientMeta>;
  abstract findOneByClientId(clientId: number): Promise<ClientMeta>;
  abstract findOneByDeviceId(deviceId: number): Promise<ClientMeta>;
  abstract findAll(): Promise<ClientMeta[]>;
  abstract update(input: ClientMeta): Promise<ClientMeta>;
  abstract remove(id: number): Promise<any>;
  abstract removeByClientId(clientId: number): Promise<any>;
}
