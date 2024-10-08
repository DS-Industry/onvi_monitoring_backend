import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '../interfaces/organization';
import { Organization } from '../domain/organization';
import { StatusOrganization } from '@prisma/client';
import slugify from 'slugify';
import { User } from '@platform-user/user/domain/user';
import { OrganizationCreateDto } from '@organization/organization/use-cases/dto/organization-create.dto';
import { IDocumentsRepository } from '@organization/documents/interfaces/documents';
import {
  Documents,
  DocumentsProps,
} from '@organization/documents/domain/documents';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly documentRepository: IDocumentsRepository,
  ) {}

  async execute(
    input: OrganizationCreateDto,
    owner: User,
  ): Promise<Organization> {
    let documentPropsDate: DocumentsProps;
    if (input.organizationType == 'LegalEntity') {
      documentPropsDate = {
        rateVat: input.rateVat,
        inn: input.inn,
        okpo: input.okpo,
        kpp: input.kpp,
        ogrn: input.ogrn,
        bik: input.bik,
        correspondentAccount: input.correspondentAccount,
        bank: input.bank,
        settlementAccount: input.settlementAccount,
        addressBank: input.addressBank,
      };
    } else {
      documentPropsDate = {
        rateVat: input.rateVat,
        inn: input.inn,
        okpo: input.okpo,
        ogrn: input.ogrn,
        bik: input.bik,
        correspondentAccount: input.correspondentAccount,
        bank: input.bank,
        settlementAccount: input.settlementAccount,
        addressBank: input.addressBank,
        certificateNumber: input.certificateNumber,
        dateCertificate: input.dateCertificate,
      };
    }
    const documentData = new Documents(documentPropsDate);
    const document = await this.documentRepository.create(documentData);
    const organizationData = new Organization({
      name: input.fullName,
      slug: slugify(input.fullName, '_'),
      address: input.addressRegistration,
      organizationStatus: StatusOrganization.VERIFICATE,
      organizationType: input.organizationType,
      organizationDocumentId: document.id,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      ownerId: owner.id,
    });
    return await this.organizationRepository.create(organizationData);
  }
}
