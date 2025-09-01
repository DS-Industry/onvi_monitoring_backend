import { ClientResponseDto } from './client-response.dto';

export class ClientPaginatedResponseDto {
  data: ClientResponseDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
