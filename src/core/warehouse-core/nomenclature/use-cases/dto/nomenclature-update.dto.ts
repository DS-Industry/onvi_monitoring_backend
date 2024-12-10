import { MeasurementNomenclature } from '@prisma/client';

export class NomenclatureUpdateDto {
  name?: string;
  sku?: string;
  organizationId?: number;
  categoryId?: number;
  supplierId?: number;
  measurement?: MeasurementNomenclature;
}
