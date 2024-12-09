import { Injectable } from '@nestjs/common';
import { INomenclatureRepository } from '@warehouse/nomenclature/interface/nomenclature';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { NomenclatureCreateDto } from '@warehouse/nomenclature/use-cases/dto/nomenclature-create.dto';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class CreateNomenclatureUseCase {
  constructor(
    private readonly nomenclatureRepository: INomenclatureRepository,
  ) {}

  async create(
    input: NomenclatureCreateDto,
    user: User,
  ): Promise<Nomenclature> {
    const nomenclatureData = new Nomenclature({
      name: input.name,
      sku: input.sku,
      organizationId: input.organizationId,
      categoryId: input.categoryId,
      supplierId: input?.supplierId,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: user.id,
      updatedById: user.id,
    });
    return await this.nomenclatureRepository.create(nomenclatureData);
  }

  async createMany(input: NomenclatureCreateDto[], user: User): Promise<void> {
    const nomenclatures: Nomenclature[] = [];
    await Promise.all(
      input.map(async (item) => {
        nomenclatures.push(
          new Nomenclature({
            name: item.name,
            sku: item.sku,
            organizationId: item.organizationId,
            categoryId: item.categoryId,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
            createdById: user.id,
            updatedById: user.id,
          }),
        );
      }),
    );
    await this.nomenclatureRepository.createMany(nomenclatures);
  }
}
