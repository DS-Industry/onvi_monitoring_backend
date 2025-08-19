import { Injectable } from '@nestjs/common';
import { INomenclatureRepository } from '@warehouse/nomenclature/interface/nomenclature';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { NomenclatureCreateDto } from '@warehouse/nomenclature/use-cases/dto/nomenclature-create.dto';
import { User } from '@platform-user/user/domain/user';
import { v4 as uuid } from 'uuid';
import { IFileAdapter } from '@libs/file/adapter';
import { NomenclatureStatus } from '@prisma/client';

@Injectable()
export class CreateNomenclatureUseCase {
  constructor(
    private readonly nomenclatureRepository: INomenclatureRepository,
    private readonly fileService: IFileAdapter,
  ) {}

  async create(
    input: NomenclatureCreateDto,
    user: User,
    file?: Express.Multer.File,
  ): Promise<Nomenclature> {
    const nomenclatureData = new Nomenclature({
      name: input.name,
      sku: input.sku,
      organizationId: input.organizationId,
      categoryId: input.categoryId,
      supplierId: input?.supplierId,
      measurement: input.measurement,
      destiny: input?.destiny,
      status: NomenclatureStatus.ACTIVE,
      metaData: input?.metaData,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: user.id,
      updatedById: user.id,
    });
    if (file) {
      const key = uuid();
      nomenclatureData.image = key;
      const keyWay = `image/${nomenclatureData.organizationId}/nomenclature/${key}`;
      await this.fileService.upload(file, keyWay);
    }
    return await this.nomenclatureRepository.create(nomenclatureData);
  }

  async createMany(input: NomenclatureCreateDto[], user: User): Promise<void> {
    const nomenclatures: Nomenclature[] = input.map(
      (item) =>
        new Nomenclature({
          name: item.name,
          sku: item.sku,
          organizationId: item.organizationId,
          categoryId: item.categoryId,
          measurement: item.measurement,
          destiny: item?.destiny,
          status: NomenclatureStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdById: user.id,
          updatedById: user.id,
        }),
    );

    await this.nomenclatureRepository.createMany(nomenclatures);
  }
}
