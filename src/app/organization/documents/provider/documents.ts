import { Provider } from '@nestjs/common';
import { IDocumentsRepository } from '@organization/documents/interfaces/documents';
import { DocumentsRepository } from '@organization/documents/repository/documents';

export const DocumentsRepositoryProvider: Provider = {
  provide: IDocumentsRepository,
  useClass: DocumentsRepository,
};
