import { Documents } from '@organization/documents/domain/documents';
import {
  OrganizationDocument as PrismaDocuments,
  Prisma,
} from '@prisma/client';

export class PrismaDocumentsMapper {
  static toDomain(entity: PrismaDocuments): Documents {
    if (!entity) {
      return null;
    }
    return new Documents({
      id: entity.id,
      rateVat: entity.rateVat,
      inn: entity.inn,
      okpo: entity.okpo,
      kpp: entity.kpp,
      ogrn: entity.ogrn,
      bik: entity.bik,
      correspondentAccount: entity.correspondentAccount,
      bank: entity.bank,
      settlementAccount: entity.settlementAccount,
      addressBank: entity.addressBank,
      documentDoc: entity.documentDoc,
      certificateNumber: entity.certificateNumber,
      dateCertificate: entity.dateCertificate,
    });
  }

  static toPrisma(
    documents: Documents,
  ): Prisma.OrganizationDocumentUncheckedCreateInput {
    return {
      id: documents?.id,
      rateVat: documents.rateVat,
      inn: documents.inn,
      okpo: documents.okpo,
      kpp: documents?.kpp,
      ogrn: documents.ogrn,
      bik: documents.bik,
      correspondentAccount: documents.correspondentAccount,
      bank: documents.bank,
      settlementAccount: documents.settlementAccount,
      addressBank: documents.addressBank,
      documentDoc: documents?.documentDoc,
      certificateNumber: documents?.certificateNumber,
      dateCertificate: documents?.dateCertificate,
    };
  }
}
