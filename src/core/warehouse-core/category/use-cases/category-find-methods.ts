import { Injectable } from '@nestjs/common';
import { ICategoryRepository } from '@warehouse/category/interface/category';
import { Category } from '@warehouse/category/domain/category';

@Injectable()
export class FindMethodsCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async getById(input: number): Promise<Category> {
    return await this.categoryRepository.findOneById(input);
  }

  async getByName(input: string): Promise<Category> {
    return await this.categoryRepository.findOneByName(input);
  }

  async getAllByOwnerCategoryId(ownerCategoryId: number): Promise<Category[]> {
    return await this.categoryRepository.findAllByOwnerCategoryId(
      ownerCategoryId,
    );
  }

  async getAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }
}
