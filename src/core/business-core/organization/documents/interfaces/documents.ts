import { Documents } from '../domain/documents';

export abstract class IDocumentsRepository {
  abstract create(input: Documents): Promise<Documents>;
  abstract findOneById(id: number): Promise<Documents>;
  abstract update(input: Documents): Promise<Documents>;
}
