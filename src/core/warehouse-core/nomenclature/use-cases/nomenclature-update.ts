import { Injectable } from '@nestjs/common';
import { INomenclatureRepository } from '@warehouse/nomenclature/interface/nomenclature';
import { User } from '@platform-user/user/domain/user';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { NomenclatureUpdateDto } from '@warehouse/nomenclature/use-cases/dto/nomenclature-update.dto';

@Injectable()
export class UpdateNomenclatureUseCase {
  constructor(
    private readonly nomenclatureRepository: INomenclatureRepository,
  ) {}

  async execute(
    input: NomenclatureUpdateDto,
    oldNomenclature: Nomenclature,
    user?: User,
  ): Promise<Nomenclature> {
    const { name, sku, organizationId, categoryId, supplierId, measurement } = input;

    oldNomenclature.name = name ? name : oldNomenclature.name;
    oldNomenclature.sku = sku ? sku : oldNomenclature.sku;
    oldNomenclature.organizationId = organizationId
      ? organizationId
      : oldNomenclature.organizationId;
    oldNomenclature.categoryId = categoryId
      ? categoryId
      : oldNomenclature.categoryId;
    oldNomenclature.supplierId = supplierId
      ? supplierId
      : oldNomenclature.supplierId;
    oldNomenclature.measurement = measurement
      ? measurement
      : oldNomenclature.measurement;

    oldNomenclature.updatedAt = new Date(Date.now());
    oldNomenclature.updatedById = user.id;
    return await this.nomenclatureRepository.update(oldNomenclature);
  }
}
