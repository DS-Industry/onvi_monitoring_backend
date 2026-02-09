import { PersonalPromocodeResponseDto } from './personal-promocode-response.dto';

export class PersonalPromocodesPaginatedResponseDto {
  data: PersonalPromocodeResponseDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
