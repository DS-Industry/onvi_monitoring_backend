import { Injectable } from '@nestjs/common';
import {
  IWarehouseDocumentRepository,
  PaginatedWarehouseDocuments,
} from '@warehouse/document/document/interface/warehouseDocument';
import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';
import { WarehouseDocumentType } from '@prisma/client';
import { PureAbility } from '@casl/ability';

@Injectable()
export class FindMethodsWarehouseDocumentUseCase {
  constructor(
    private readonly warehouseDocumentRepository: IWarehouseDocumentRepository,
  ) {}

  async getOneById(id: number): Promise<WarehouseDocument> {
    return await this.warehouseDocumentRepository.findOneById(id);
  }

  async getOneByName(name: string): Promise<WarehouseDocument> {
    return await this.warehouseDocumentRepository.findOneByName(name);
  }

  async getAllByWarehouseId(warehouseId: number): Promise<WarehouseDocument[]> {
    return await this.warehouseDocumentRepository.findAllByWarehouseId(
      warehouseId,
    );
  }

  async getAllByWarehouseIdAndDate(
    warehouseId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<WarehouseDocument[]> {
    return await this.warehouseDocumentRepository.findAllByWarehouseIdAndDate(
      warehouseId,
      dateStart,
      dateEnd,
    );
  }

  async getAllByWarehouseIdsAndDate(
    dateStart: Date,
    dateEnd: Date,
    ability: PureAbility,
    warehouseId?: number,
    placementId?: number,
    page?: number,
    size?: number,
  ): Promise<WarehouseDocument[]> {
    return await this.warehouseDocumentRepository.getAllByWarehouseIdsAndDate(
      dateStart,
      dateEnd,
      ability,
      warehouseId,
      placementId,
      page,
      size,
    );
  }

  async getAllByWarehouseIdsAndDatePaginated(
    dateStart: Date,
    dateEnd: Date,
    ability: PureAbility,
    warehouseId?: number,
    placementId?: number,
    page?: number,
    size?: number,
  ): Promise<PaginatedWarehouseDocuments> {
    return await this.warehouseDocumentRepository.getAllByWarehouseIdsAndDatePaginated(
      dateStart,
      dateEnd,
      ability,
      warehouseId,
      placementId,
      page,
      size,
    );
  }

  async getAllByWarehouseIdAndType(
    warehouseId: number,
    type: WarehouseDocumentType,
  ): Promise<WarehouseDocument[]> {
    return await this.warehouseDocumentRepository.findAllByWarehouseIdAndType(
      warehouseId,
      type,
    );
  }

  async getAllByType(
    type: WarehouseDocumentType,
  ): Promise<WarehouseDocument[]> {
    return await this.warehouseDocumentRepository.findAllByType(type);
  }
}
