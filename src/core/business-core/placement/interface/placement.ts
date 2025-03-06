import { Placement } from '@business-core/placement/domain/placement';

export abstract class IPlacementRepository {
  abstract create(input: Placement): Promise<Placement>;
  abstract findOneById(id: number): Promise<Placement>;
  abstract findAll(): Promise<Placement[]>;
}
