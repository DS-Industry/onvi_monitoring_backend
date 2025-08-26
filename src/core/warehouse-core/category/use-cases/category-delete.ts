import { Injectable } from '@nestjs/common';
import { ICategoryRepository } from '@warehouse/category/interface/category';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
