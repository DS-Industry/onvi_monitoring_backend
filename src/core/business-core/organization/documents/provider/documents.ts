import { Provider } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/documents';
import { DocumentsRepository } from '../repository/documents';

export const DocumentsRepositoryProvider: Provider = {
  provide: IDocumentsRepository,
  useClass: DocumentsRepository,
};
