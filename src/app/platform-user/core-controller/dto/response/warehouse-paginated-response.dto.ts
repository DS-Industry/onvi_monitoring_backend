import { WarehouseResponseDto } from './warehouse-response.dto';

export class WarehousePaginatedResponseDto {
  data: WarehouseResponseDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
