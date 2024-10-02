import { Injectable } from '@nestjs/common';
import { UpdateOrganizationUseCase } from './organization-update';
import { CreateDocumentUseCase } from '../../documents/use-cases/document-create';
import { StatusOrganization } from '@prisma/client';
import { CreateDocumentDto } from '@organization/documents/use-cases/dto/organization-document-create.dto';
import { Organization } from '@organization/organization/domain/organization';

@Injectable()
export class AddDocumentUseCase {
  constructor(
    private readonly organizationUpdateUseCase: UpdateOrganizationUseCase,
    private readonly documentCreateUseCase: CreateDocumentUseCase,
  ) {}

  async execute(input: CreateDocumentDto, file: Express.Multer.File) {
    const document = await this.documentCreateUseCase.execute(
      input,
      file,
      input.organizationId,
    );
    const updateOrganizationData = {
      id: input.organizationId,
      organizationDocumentId: document.id,
      organizationStatus: StatusOrganization.PENDING,
    };
    return await this.organizationUpdateUseCase.execute(updateOrganizationData);
  }
}
