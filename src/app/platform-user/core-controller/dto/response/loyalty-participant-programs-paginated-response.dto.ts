import { LoyaltyProgramParticipantResponseDto } from './loyalty-program-participant-response.dto';

export class LoyaltyParticipantProgramsPaginatedResponseDto {
  data: LoyaltyProgramParticipantResponseDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
