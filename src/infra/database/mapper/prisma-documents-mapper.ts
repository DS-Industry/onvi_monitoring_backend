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
      fullName: entity.fullName,
      okpo: entity.okpo,
      kpp: entity.kpp,
      addressRegistration: entity.addressRegistration,
      ogrn: entity.ogrn,
      bik: entity.bik,
      correspondentAccount: entity.correspondentAccount,
      bank: entity.bank,
      settlementAccount: entity.settlementAccount,
      address: entity.address,
      documentDoc: entity.documentDoc,
    });
  }

  static toPrisma(
    documents: Documents,
  ): Prisma.OrganizationDocumentUncheckedCreateInput {
    return {
      id: documents?.id,
      rateVat: documents.rateVat,
      inn: documents.inn,
      fullName: documents.fullName,
      okpo: documents.okpo,
      kpp: documents.kpp,
      addressRegistration: documents.addressRegistration,
      ogrn: documents.ogrn,
      bik: documents.bik,
      correspondentAccount: documents.correspondentAccount,
      bank: documents.bank,
      settlementAccount: documents.settlementAccount,
      address: documents.address,
      documentDoc: documents?.documentDoc,
    };
  }
}
