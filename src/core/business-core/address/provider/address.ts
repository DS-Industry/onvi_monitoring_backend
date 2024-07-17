import { Provider } from '@nestjs/common';
import { IAddressRepository } from '../interfaces/address';
import { AddressRepository } from '../repository/address';

export const AddressRepositoryProvider: Provider = {
  provide: IAddressRepository,
  useClass: AddressRepository,
};
