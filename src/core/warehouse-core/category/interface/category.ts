import { Category } from '@warehouse/category/domain/category';

export abstract class ICategoryRepository {
  abstract create(input: Category): Promise<Category>;
  abstract findOneById(id: number): Promise<Category>;
  abstract findOneByName(name: string): Promise<Category>;
  abstract findAllByOwnerCategoryId(
    ownerCategoryId: number,
  ): Promise<Category[]>;
  abstract update(input: Category): Promise<Category>;
}
