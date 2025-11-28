import {
  DestinyNomenclature,
  MeasurementNomenclature,
  NomenclatureStatus,
} from '@prisma/client';
import { NomenclatureMeta } from '@warehouse/nomenclature/interface/nomenclatureMeta';

export class NomenclatureUpdateDto {
  name?: string;
  sku?: string;
  organizationId?: number;
  categoryId?: number;
  supplierId?: number;
  measurement?: MeasurementNomenclature;
  destiny?: DestinyNomenclature;
  metaData?: NomenclatureMeta;
  status?: NomenclatureStatus;
}
