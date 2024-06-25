import { Address } from '@address/domain/address';
import { Address as PrismaAddress, Prisma } from '@prisma/client';

export class PrismaAddressMapper {
  static toDomain(entity: PrismaAddress): Address {
    if (!entity) {
      return null;
    }
    return new Address({
      id: entity.id,
      city: entity.city,
      location: entity.location,
      lat: entity.lat,
      lon: entity.lon,
    });
  }

  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: address?.id,
      city: address.city,
      location: address.location,
      lat: address.lat,
      lon: address.lon,
    };
  }
}
