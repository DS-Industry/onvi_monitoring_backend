import { CorporateCardOperationResponseDto } from './corporate-card-operation-response.dto';

export class CorporateCardsOperationsPaginatedResponseDto {
  data: CorporateCardOperationResponseDto[];
  total: number;
  skip: number;
  take: number;
}
