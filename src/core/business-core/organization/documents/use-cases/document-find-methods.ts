import { Injectable } from "@nestjs/common";
import { IDocumentsRepository } from "@organization/documents/interfaces/documents";

@Injectable()
export class FindMethodsDocumentUseCase {
  constructor(private readonly documentRepository: IDocumentsRepository) {}

  async getById(input: number): Promise<any> {
    return await this.documentRepository.findOneById(input);
  }
}
