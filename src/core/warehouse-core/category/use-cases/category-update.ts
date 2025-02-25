import { Injectable } from '@nestjs/common';
import { ICategoryRepository } from '@warehouse/category/interface/category';
import { CategoryUpdateDto } from '@warehouse/category/use-cases/dto/category-update.dto';
import { Category } from '@warehouse/category/domain/category';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(
    input: CategoryUpdateDto,
    oldCategory: Category,
  ): Promise<Category> {
    const { name, description } = input;

    oldCategory.name = name ? name : oldCategory.name;
    oldCategory.description = description
      ? description
      : oldCategory.description;

    return await this.categoryRepository.update(oldCategory);
  }
}
