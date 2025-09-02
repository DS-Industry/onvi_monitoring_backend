import { CorporateCardResponseDto } from './corporate-card-response.dto';

export class CorporateCardsPaginatedResponseDto {
  data: CorporateCardResponseDto[];
  total: number;
  skip: number;
  take: number;
}
