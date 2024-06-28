import { Injectable } from '@nestjs/common';
import { UpdateOrganizationUseCase } from '@organization/organization/use-cases/organization-update';
import { GetByIdOrganizationUseCase } from '@organization/organization/use-cases/organization-get-by-id';
import { CreateDocumentDto } from '@organization/organization/controller/dto/document-create.dto';
import { CreateDocumentUseCase } from '@organization/documents/use-cases/document-create';
import { StatusOrganization } from '@prisma/client';

@Injectable()
export class AddDocumentUseCase {
  constructor(
    private readonly organizationUpdateUseCase: UpdateOrganizationUseCase,
    private readonly organizationGetByIdUseCase: GetByIdOrganizationUseCase,
    private readonly documentCreateUseCase: CreateDocumentUseCase,
  ) {}

  async execute(input: CreateDocumentDto, file: Express.Multer.File) {
    const organization = await this.organizationGetByIdUseCase.execute(
      input.organizationId,
    );
    if (organization.organizationDocumentId) {
      throw new Error('organizationDocument exists');
    }

    const document = await this.documentCreateUseCase.execute(
      input,
      file,
      organization.slug,
    );
    const updateOrganizationData = {
      id: organization.id,
      organizationDocumentId: document.id,
      organizationStatus: StatusOrganization.PENDING,
    };
    return await this.organizationUpdateUseCase.execute(updateOrganizationData);
  }
}
