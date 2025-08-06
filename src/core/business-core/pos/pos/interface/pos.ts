import { Pos } from '@pos/pos/domain/pos';
import { PosResponseDto } from "@platform-user/core-controller/dto/response/pos-response.dto";

export abstract class IPosRepository {
  abstract create(input: Pos): Promise<Pos>;
  abstract findOneById(id: number): Promise<Pos>;
  abstract findOneByName(name: string): Promise<Pos>;
  abstract findAllByFilter(
    ability?: any,
    placementId?: number,
    organizationId?: number,
    userId?: number,
    skip?: number,
    take?: number,
  ): Promise<PosResponseDto[]>;
  abstract update(input: Pos): Promise<Pos>;
  abstract countAllByAbilityAndPlacement(
    ability: any,
    placementId?: number | '*',
  ): Promise<number>;
  abstract updateConnectionWorker(
    posId: number,
    addWorkerIds: number[],
    deleteWorkerIds: number[],
  ): Promise<any>;
}
