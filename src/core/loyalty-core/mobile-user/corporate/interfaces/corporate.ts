import { Corporate } from '@loyalty/mobile-user/corporate/domain/corporate';
import { CorporateClientResponseDto } from '@platform-user/core-controller/dto/response/corporate-client-response.dto';

export interface CorporateStatsResult {
  totalBalance: number;
  numberOfCards: number;
}

export abstract class ICorporateRepository {
  abstract create(input: Corporate): Promise<Corporate>;
  abstract findOneById(id: number): Promise<Corporate>;
  abstract findAllByOwnerId(ownerId: number): Promise<Corporate[]>;
  abstract update(input: Corporate): Promise<Corporate>;
  abstract findAllByFilter(
    placementId?: number,
    search?: string,
    inn?: string,
    ownerPhone?: string,
    name?: string,
    skip?: number,
    take?: number,
    registrationFrom?: string,
    registrationTo?: string,
  ): Promise<Corporate[]>;
  abstract countByFilter(
    placementId?: number,
    search?: string,
    inn?: string,
    ownerPhone?: string,
    name?: string,
    registrationFrom?: string,
    registrationTo?: string,
  ): Promise<number>;
  abstract getStatsById(id: number): Promise<CorporateStatsResult>;
}
