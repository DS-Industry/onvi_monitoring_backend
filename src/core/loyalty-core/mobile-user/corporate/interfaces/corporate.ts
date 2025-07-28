import { Corporate } from '@loyalty/mobile-user/corporate/domain/corporate';

export abstract class ICorporateRepository {
  abstract create(input: Corporate): Promise<Corporate>;
  abstract findOneById(id: number): Promise<Corporate>;
  abstract findAllByOwnerId(ownerId: number): Promise<Corporate[]>;
  abstract update(input: Corporate): Promise<Corporate>;
}
