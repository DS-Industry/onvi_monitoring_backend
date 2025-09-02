import { CorporateCardOperationResponseDto } from './corporate-card-operation-response.dto';

export class CorporateCardsOperationsPaginatedResponseDto {
  data: CorporateCardOperationResponseDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
