import { Provider } from '@nestjs/common';
import { ICategoryRepository } from '@warehouse/category/interface/category';
import { CategoryRepository } from '@warehouse/category/repository/category';

export const CategoryProvider: Provider = {
  provide: ICategoryRepository,
  useClass: CategoryRepository,
};
