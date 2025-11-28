import { CorporateClientResponseDto } from './corporate-client-response.dto';

export class CorporateClientsPaginatedResponseDto {
  data: CorporateClientResponseDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
