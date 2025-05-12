import { Injectable } from '@nestjs/common';
import { ICategoryRepository } from '@warehouse/category/interface/category';
import { CategoryCreateDto } from '@warehouse/category/use-cases/dto/category-create.dto';
import { Category } from '@warehouse/category/domain/category';

@Injectable()
export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: CategoryCreateDto): Promise<Category> {
    const categoryData = new Category({
      name: input.name,
      description: input?.description,
      ownerCategoryId: input?.ownerCategoryId,
    });
    return await this.categoryRepository.create(categoryData);
  }
}
