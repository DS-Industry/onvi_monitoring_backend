import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '../interfaces/organization';
import { UpdateOrganizationDto } from '@organization/organization/use-cases/dto/organization-update.dto';
import { IDocumentsRepository } from '@organization/documents/interfaces/documents';
import slugify from 'slugify';
import { Organization } from "@organization/organization/domain/organization";

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly documentsRepository: IDocumentsRepository,
  ) {}

  async execute(input: UpdateOrganizationDto, organization: Organization) {
    const document = await this.documentsRepository.findOneById(
      organization.organizationDocumentId,
    );
    const {
      fullName,
      rateVat,
      inn,
      okpo,
      kpp,
      addressRegistration,
      ogrn,
      bik,
      correspondentAccount,
      bank,
      settlementAccount,
      addressBank,
      certificateNumber,
      dateCertificate,
    } = input;

    organization.name = fullName ? fullName : organization.name;
    organization.slug = fullName ? slugify(fullName, '_') : organization.slug;
    organization.address = addressRegistration
      ? addressRegistration
      : organization.address;

    organization.updatedAt = new Date(Date.now());

    if (organization.organizationType == 'LegalEntity') {
      document.kpp = kpp ? kpp : document.kpp;
    } else {
      document.certificateNumber = certificateNumber
        ? certificateNumber
        : document.certificateNumber;
      document.dateCertificate = dateCertificate
        ? dateCertificate
        : document.dateCertificate;
    }
    document.rateVat = rateVat ? rateVat : document.rateVat;
    document.inn = inn ? inn : document.inn;
    document.okpo = okpo ? okpo : document.okpo;
    document.ogrn = ogrn ? ogrn : document.ogrn;
    document.bik = bik ? bik : document.bik;
    document.correspondentAccount = correspondentAccount
      ? correspondentAccount
      : document.correspondentAccount;
    document.bank = bank ? bank : document.bank;
    document.settlementAccount = settlementAccount
      ? settlementAccount
      : document.settlementAccount;
    document.addressBank = addressBank ? addressBank : document.addressBank;

    await this.documentsRepository.update(document);
    return await this.organizationRepository.update(organization);
  }
}
