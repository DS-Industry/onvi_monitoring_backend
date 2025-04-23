import { Injectable } from '@nestjs/common';
import { INomenclatureRepository } from '@warehouse/nomenclature/interface/nomenclature';
import { User } from '@platform-user/user/domain/user';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { NomenclatureUpdateDto } from '@warehouse/nomenclature/use-cases/dto/nomenclature-update.dto';
import { IFileAdapter } from '@libs/file/adapter';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UpdateNomenclatureUseCase {
  constructor(
    private readonly nomenclatureRepository: INomenclatureRepository,
    private readonly fileService: IFileAdapter,
  ) {}

  async execute(
    input: NomenclatureUpdateDto,
    oldNomenclature: Nomenclature,
    user?: User,
    file?: Express.Multer.File,
  ): Promise<Nomenclature> {
    const {
      name,
      sku,
      organizationId,
      categoryId,
      supplierId,
      measurement,
      status,
      metaData,
    } = input;

    if (file) {
      if (oldNomenclature.image) {
        await this.fileService.delete(
          `image/${oldNomenclature.organizationId}/nomenclature/${oldNomenclature.image}`,
        );
      }
      const key = uuid();
      oldNomenclature.image = key;
      const keyWay = `image/${oldNomenclature.organizationId}/nomenclature/${key}`;
      await this.fileService.upload(file, keyWay);
    }

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
    oldNomenclature.status = status ? status : oldNomenclature.status;

    if (metaData) {
      const { description, weight, height, width, length, purpose } = metaData;

      oldNomenclature.metaData = oldNomenclature.metaData || {};
      oldNomenclature.metaData.description =
        description ?? oldNomenclature.metaData.description;
      oldNomenclature.metaData.weight =
        weight ?? oldNomenclature.metaData.weight;
      oldNomenclature.metaData.height =
        height ?? oldNomenclature.metaData.height;
      oldNomenclature.metaData.width = width ?? oldNomenclature.metaData.width;
      oldNomenclature.metaData.length =
        length ?? oldNomenclature.metaData.length;
      oldNomenclature.metaData.purpose =
        purpose ?? oldNomenclature.metaData.purpose;
    }

    oldNomenclature.updatedAt = new Date(Date.now());
    oldNomenclature.updatedById = user.id;
    return await this.nomenclatureRepository.update(oldNomenclature);
  }
}
