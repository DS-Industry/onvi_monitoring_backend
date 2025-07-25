import { Position } from '@hr/position/domain/position';
import { User } from "@platform-user/user/domain/user";

export abstract class IPositionRepository {
  abstract create(input: Position): Promise<Position>;
  abstract findOneById(id: number): Promise<Position>;
  abstract findAll(): Promise<Position[]>;
  abstract findAllByOrgId(orgId: number): Promise<Position[]>;
  abstract findAllByUser(user: User): Promise<Position[]>;
  abstract update(input: Position): Promise<Position>;
}
