import { MeasurementNomenclature } from "@prisma/client";

export class NomenclatureCreateDto {
  name: string;
  sku: string;
  organizationId: number;
  categoryId: number;
  supplierId?: number;
  measurement: MeasurementNomenclature;
}
