import { Injectable } from '@nestjs/common';
import { IAddressRepository } from '@address/interfaces/address';
import { PrismaService } from '@db/prisma/prisma.service';
import { Address } from '@address/domain/address';
import { PrismaAddressMapper } from '@db/mapper/prisma-address-mapper';

@Injectable()
export class AddressRepository extends IAddressRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Address): Promise<Address> {
    const addressPrismaEntity = PrismaAddressMapper.toPrisma(input);
    const address = await this.prisma.address.create({
      data: addressPrismaEntity,
    });
    return PrismaAddressMapper.toDomain(address);
  }

  public async findAll(): Promise<Address[]> {
    const address = await this.prisma.address.findMany();
    return address.map((item) => PrismaAddressMapper.toDomain(item));
  }

  public async findOneById(id: number): Promise<Address> {
    const address = await this.prisma.address.findFirst({
      where: {
        id,
      },
    });
    return PrismaAddressMapper.toDomain(address);
  }

  public async findOneByLocation(location: string): Promise<Address> {
    const address = await this.prisma.address.findFirst({
      where: {
        location,
      },
    });
    return PrismaAddressMapper.toDomain(address);
  }

  public async update(id: number, input: Address): Promise<Address> {
    const addressPrismaEntity = PrismaAddressMapper.toPrisma(input);
    const address = await this.prisma.address.update({
      where: {
        id: id,
      },
      data: addressPrismaEntity,
    });
    return PrismaAddressMapper.toDomain(address);
  }
}
