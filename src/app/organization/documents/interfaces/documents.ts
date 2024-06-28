import { Documents } from '@organization/documents/domain/documents';

export abstract class IDocumentsRepository {
  abstract create(input: Documents): Promise<Documents>;
  abstract findOneById(id: number): Promise<Documents>;
  abstract update(id: number, input: Documents): Promise<Documents>;
}
