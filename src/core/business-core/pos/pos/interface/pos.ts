import { Pos } from '@pos/pos/domain/pos';

export abstract class IPosRepository {
  abstract create(input: Pos): Promise<Pos>;
  abstract findOneById(id: number): Promise<Pos>;
  abstract findOneByName(name: string): Promise<Pos>;
  abstract findOneBySlug(slug: string): Promise<Pos>;
  abstract findAll(): Promise<Pos[]>;
  abstract findAllByOrgId(orgId: number): Promise<Pos[]>;
  abstract findAllByUserId(userId: number): Promise<Pos[]>;
  abstract findAllByPermission(
    ability: any,
    placementId?: number | '*',
  ): Promise<Pos[]>;
  abstract update(input: Pos): Promise<Pos>;
}
