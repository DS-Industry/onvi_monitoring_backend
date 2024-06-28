import { Injectable } from '@nestjs/common';
import { IAddressRepository } from '@address/interfaces/address';
import { AddressCreateDto } from '@address/use-case/dto/address-create.dto';
import { Address } from '@address/domain/address';

@Injectable()
export class CreateAddressUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(input: AddressCreateDto): Promise<any> {
    const checkAddress = await this.addressRepository.findOneByLocation(
      input.location,
    );
    if (checkAddress) {
      throw new Error('address exists');
    }

    const addressData = new Address({
      city: input.city,
      location: input.location,
      lat: input.lat,
      lon: input.lon,
    });
    return await this.addressRepository.create(addressData);
  }
}
