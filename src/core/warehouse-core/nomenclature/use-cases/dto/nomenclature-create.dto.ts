import { MeasurementNomenclature } from '@prisma/client';
import { NomenclatureMeta } from '@warehouse/nomenclature/interface/nomenclatureMeta';

export class NomenclatureCreateDto {
  name: string;
  sku: string;
  organizationId: number;
  categoryId: number;
  supplierId?: number;
  measurement: MeasurementNomenclature;
  metaData?: NomenclatureMeta;
}
