import { WarehouseDocumentAllByFilterResponseDto } from './warehouseDocument-all-by-filter-response.dto';

export class WarehouseDocumentPaginatedResponseDto {
  data: WarehouseDocumentAllByFilterResponseDto[];
  page: number;
  size: number;
  total: number;
}
