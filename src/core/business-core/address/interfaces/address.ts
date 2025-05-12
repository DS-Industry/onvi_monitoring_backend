import { Address } from '../domain/address';

export abstract class IAddressRepository {
  abstract create(input: Address): Promise<Address>;
  abstract findOneById(id: number): Promise<Address>;
  abstract findOneByLocation(location: string): Promise<Address>;
  abstract findAll(): Promise<Address[]>;
  abstract update(id: number, input: Address): Promise<Address>;
}
