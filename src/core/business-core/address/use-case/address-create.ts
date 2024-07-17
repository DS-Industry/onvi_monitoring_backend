import { Injectable } from '@nestjs/common';
import { IAddressRepository } from '../interfaces/address';
import { AddressCreateDto } from './dto/address-create.dto';
import { Address } from '../domain/address';

@Injectable()
export class CreateAddressUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(input: AddressCreateDto): Promise<any> {
    const addressData = new Address({
      city: input.city,
      location: input.location,
      lat: input.lat,
      lon: input.lon,
    });
    return await this.addressRepository.create(addressData);
  }
}
