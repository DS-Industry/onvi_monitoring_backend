import { Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/documents';
import { v4 as uuid } from 'uuid';
import { IFileAdapter } from '@libs/file/adapter';
import { Documents } from '../domain/documents';
import { CreateDocumentDto } from '@organization/documents/use-cases/dto/organization-document-create.dto';

@Injectable()
export class CreateDocumentUseCase {
  constructor(
    private readonly documentRepository: IDocumentsRepository,
    private readonly fileService: IFileAdapter,
  ) {}

  async execute(
    input: CreateDocumentDto,
    file: Express.Multer.File,
    organizationId: number,
  ) {
    const keyDocument = uuid();
    const documentData = new Documents({
      rateVat: input.rateVat,
      inn: input.inn,
      fullName: input.fullName,
      okpo: input.okpo,
      kpp: input.kpp,
      addressRegistration: input.addressRegistration,
      ogrn: input.ogrn,
      bik: input.bik,
      correspondentAccount: input.correspondentAccount,
      bank: input.bank,
      settlementAccount: input.settlementAccount,
      address: input.address,
      documentDoc: keyDocument,
    });

    const document = await this.documentRepository.create(documentData);
    const keyWay = 'organization/document/' + organizationId + '/' + keyDocument;
    await this.fileService.upload(file, keyWay);

    return document;
  }
}
