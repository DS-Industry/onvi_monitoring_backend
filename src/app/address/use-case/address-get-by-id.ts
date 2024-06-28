import { Injectable } from '@nestjs/common';
import { IAddressRepository } from '@address/interfaces/address';

@Injectable()
export class GetByIdAddressUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(input: number) {
    const address = await this.addressRepository.findOneById(input);
    if (!address) {
      throw new Error('address not exists');
    }
    return address;
  }
}
