import { Position } from '@hr/position/domain/position';

export abstract class IPositionRepository {
  abstract create(input: Position): Promise<Position>;
  abstract findOneById(id: number): Promise<Position>;
  abstract findAll(): Promise<Position[]>;
  abstract findAllByOrgId(orgId: number): Promise<Position[]>;
  abstract findAllByAbility(ability: any): Promise<Position[]>;
  abstract update(input: Position): Promise<Position>;
}
