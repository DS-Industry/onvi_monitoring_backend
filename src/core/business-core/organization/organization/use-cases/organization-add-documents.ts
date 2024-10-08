import { Injectable } from '@nestjs/common';
import { UpdateOrganizationUseCase } from './organization-update';
import { StatusOrganization } from '@prisma/client';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { v4 as uuid } from 'uuid';
import { IFileAdapter } from '@libs/file/adapter';
import { IDocumentsRepository } from '@organization/documents/interfaces/documents';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';

@Injectable()
export class AddDocumentUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly documentRepository: IDocumentsRepository,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly fileService: IFileAdapter,
  ) {}

  async execute(organizationId: number, file: Express.Multer.File) {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    const document = await this.documentRepository.findOneById(
      organization.organizationDocumentId,
    );

    const keyDocument = uuid();
    document.documentDoc = keyDocument;
    const keyWay =
      'organization/document/' + organization.name + '/' + keyDocument;
    await this.fileService.upload(file, keyWay);

    await this.documentRepository.update(document);
    organization.organizationStatus = StatusOrganization.PENDING;
    return await this.organizationRepository.update(organization);
  }
}
