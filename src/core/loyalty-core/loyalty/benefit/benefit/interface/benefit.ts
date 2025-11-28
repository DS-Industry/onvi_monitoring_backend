import { Benefit } from '@loyalty/loyalty/benefit/benefit/domain/benefit';

export abstract class IBenefitRepository {
  abstract create(input: Benefit): Promise<Benefit>;
  abstract findOneById(id: number): Promise<Benefit>;
  abstract findAllByLoyaltyTierId(tierId: number): Promise<Benefit[]>;
  abstract findAll(): Promise<Benefit[]>;
  abstract update(input: Benefit): Promise<Benefit>;
}
