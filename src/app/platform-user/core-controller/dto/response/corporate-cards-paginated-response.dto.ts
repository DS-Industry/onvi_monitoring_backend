import { CorporateCardResponseDto } from './corporate-card-response.dto';

export class CorporateCardsPaginatedResponseDto {
  data: CorporateCardResponseDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
