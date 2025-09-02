import { Corporate } from '@loyalty/mobile-user/corporate/domain/corporate';
import { CorporateClientResponseDto } from '@platform-user/core-controller/dto/response/corporate-client-response.dto';

export abstract class ICorporateRepository {
  abstract create(input: Corporate): Promise<Corporate>;
  abstract findOneById(id: number): Promise<Corporate>;
  abstract findOneByIdWithStats(id: number): Promise<any>;
  abstract findAllByOwnerId(ownerId: number): Promise<Corporate[]>;
  abstract update(input: Corporate): Promise<Corporate>;
  abstract findAllByFilter(
    organizationId: number,
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
    organizationId: number,
    placementId?: number,
    search?: string,
    inn?: string,
    ownerPhone?: string,
    name?: string,
    registrationFrom?: string,
    registrationTo?: string,
  ): Promise<number>;
}
