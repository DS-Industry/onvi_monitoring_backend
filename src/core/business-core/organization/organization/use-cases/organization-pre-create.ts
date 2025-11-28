import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';
import { Organization } from '@organization/organization/domain/organization';
import { User } from '@platform-user/user/domain/user';
import { OrganizationPreCreateDto } from '@organization/organization/use-cases/dto/organization-pre-create.dto';
import slugify from 'slugify';
import { StatusOrganization } from '@prisma/client';

@Injectable()
export class PreCreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(
    input: OrganizationPreCreateDto,
    owner: User,
  ): Promise<Organization> {
    const organizationData = new Organization({
      name: input.fullName,
      slug: slugify(input.fullName, '_'),
      address: input.addressRegistration,
      organizationStatus: StatusOrganization.VERIFICATE,
      organizationType: input.organizationType,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      ownerId: owner.id,
    });
    return await this.organizationRepository.create(organizationData);
  }
}
