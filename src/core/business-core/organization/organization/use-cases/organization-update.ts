import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '../interfaces/organization';
import { UpdateOrganizationDto } from '@platform-user/organization/controller/dto/organization-update.dto';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(input: UpdateOrganizationDto) {
    const organization = await this.organizationRepository.findOneById(
      input.id,
    );
    if (!organization) {
      throw new Error('organization not exists');
    }
    const { organizationDocumentId, organizationType, organizationStatus } =
      input;

    organization.organizationDocumentId = organizationDocumentId
      ? organizationDocumentId
      : organization.organizationDocumentId;
    organization.organizationType = organizationType
      ? organizationType
      : organization.organizationType;
    organization.organizationStatus = organizationStatus
      ? organizationStatus
      : organization.organizationStatus;
    organization.updatedAt = new Date(Date.now());

    return await this.organizationRepository.update(
      organization.id,
      organization,
    );
  }
}
