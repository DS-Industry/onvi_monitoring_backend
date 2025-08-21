import { Injectable } from '@nestjs/common';
import { ICategoryRepository } from '@warehouse/category/interface/category';
import { PrismaService } from '@db/prisma/prisma.service';
import { Category } from '@warehouse/category/domain/category';
import { PrismaCategoryMapper } from '@db/mapper/prisma-category-mapper';

@Injectable()
export class CategoryRepository extends ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Category): Promise<Category> {
    const categoryEntity = PrismaCategoryMapper.toPrisma(input);
    const category = await this.prisma.category.create({
      data: categoryEntity,
    });
    return PrismaCategoryMapper.toDomain(category);
  }

  public async findOneById(id: number): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });
    return PrismaCategoryMapper.toDomain(category);
  }

  public async findOneByName(name: string): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: {
        name,
      },
    });
    return PrismaCategoryMapper.toDomain(category);
  }

  public async findManyByIds(ids: number[]): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return categories.map((item) => PrismaCategoryMapper.toDomain(item));
  }

  public async findAllByOwnerCategoryId(
    ownerCategoryId: number,
  ): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        ownerCategoryId,
      },
    });
    return categories.map((item) => PrismaCategoryMapper.toDomain(item));
  }

  public async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();
    return categories.map((item) => PrismaCategoryMapper.toDomain(item));
  }

  public async update(input: Category): Promise<Category> {
    const categoryEntity = PrismaCategoryMapper.toPrisma(input);
    const category = await this.prisma.category.update({
      where: {
        id: input.id,
      },
      data: categoryEntity,
    });
    return PrismaCategoryMapper.toDomain(category);
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
