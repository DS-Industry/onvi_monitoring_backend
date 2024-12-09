export class NomenclatureCreateDto {
  name: string;
  sku: string;
  organizationId: number;
  categoryId: number;
  supplierId?: number;
}
