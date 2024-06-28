import { Provider } from '@nestjs/common';
import { IAddressRepository } from '@address/interfaces/address';
import { AddressRepository } from '@address/repository/address';

export const AddressRepositoryProvider: Provider = {
  provide: IAddressRepository,
  useClass: AddressRepository,
};
