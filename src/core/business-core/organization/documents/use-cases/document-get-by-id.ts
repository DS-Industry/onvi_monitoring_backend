import { Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/documents';

@Injectable()
export class GetByIdDocumentUseCase {
  constructor(private readonly documentRepository: IDocumentsRepository) {}

  async execute(input: number): Promise<any> {
    const document = await this.documentRepository.findOneById(input);
    if (!document) {
      throw new Error('document not exists');
    }
    return document;
  }
}
