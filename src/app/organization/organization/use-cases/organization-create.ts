import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';
import { CreateAddressUseCase } from '@address/use-case/address-create';
import { OrganizationCreateDto } from '@organization/organization/controller/dto/organization-create.dto';
import { GetByIdUserUseCase } from '@platform-user/user/use-cases/user-get-by-id';
import { Organization } from '@organization/organization/domain/organization';
import { StatusOrganization } from '@prisma/client';
import slugify from 'slugify';
import { User } from "@platform-user/user/domain/user";

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly getByIdUserUseCase: GetByIdUserUseCase,
  ) {}

  async execute(input: OrganizationCreateDto, owner: User): Promise<any> {
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
