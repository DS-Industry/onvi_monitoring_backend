import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '../interfaces/organization';
import { CreateAddressUseCase } from '@address/use-case/address-create';
import { OrganizationCreateDto } from '@platform-user/organization/controller/dto/organization-create.dto';
import { Organization } from '../domain/organization';
import { StatusOrganization } from '@prisma/client';
import slugify from 'slugify';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly createAddressUseCase: CreateAddressUseCase,
  ) {}

  async execute(
    input: OrganizationCreateDto,
    owner: User,
  ): Promise<Organization> {
    const checkOrganization = await this.organizationRepository.findOneByName(
      input.name,
    );
    if (checkOrganization) {
      throw new Error('organization exists');
    }

    const address = await this.createAddressUseCase.execute(input.address);
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

    return await this.organizationRepository.create(organizationData);
  }
}
