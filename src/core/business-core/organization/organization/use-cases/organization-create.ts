import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '../interfaces/organization';
import { Organization } from '../domain/organization';
import { StatusOrganization } from '@prisma/client';
import slugify from 'slugify';
import { User } from '@platform-user/user/domain/user';
import { IAddressRepository } from '@address/interfaces/address';
import { Address } from '@address/domain/address';
import { OrganizationCreateDto } from '@organization/organization/use-cases/dto/organization-create.dto';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(
    input: OrganizationCreateDto,
    owner: User,
  ): Promise<Organization> {
    const addressData = new Address({
      city: input.address.city,
      location: input.address.location,
      lat: input?.address.lat,
      lon: input?.address.lon,
    });
    const address = await this.addressRepository.create(addressData);
    const organizationData = new Organization({
      name: input.name,
      slug: slugify(input.name, '_'),
      addressId: address.id,
      organizationStatus: StatusOrganization.VERIFICATE,
      organizationType: input.organizationType,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      ownerId: owner.id,
    });

    return await this.organizationRepository.create(
      organizationData,
      addressData,
    );
  }
}
