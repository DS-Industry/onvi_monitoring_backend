import { Worker } from '@hr/worker/domain/worker';
import { PaymentType } from '@prisma/client';

export abstract class IWorkerRepository {
  abstract create(input: Worker): Promise<Worker>;
  abstract findOneById(id: number): Promise<Worker>;
  abstract findAllByIds(ids: number[]): Promise<Worker[]>;
  abstract findAllByPosId(posId: number): Promise<Worker[]>;
  abstract findAllByFilter(
    userId?: number,
    placementId?: number,
    hrPositionId?: number,
    organizationId?: number,
    name?: string,
    skip?: number,
    take?: number,
    posId?: number,
    search?: string,
  ): Promise<Worker[]>;
  abstract findAllByFilterCount(
    userId?: number,
    placementId?: number,
    hrPositionId?: number,
    organizationId?: number,
    name?: string,
    posId?: number,
    search?: string,
  ): Promise<number>;
  abstract findAllForCalculatePayment(
    userId: number,
    organizationId: number,
    billingMonth: Date,
    hrPositionId?: number,
    paymentType?: PaymentType,
  ): Promise<Worker[]>;
  abstract update(input: Worker): Promise<Worker>;
  abstract findPosesByWorkerId(workerId: number): Promise<any[]>;
  abstract updateConnectionPos(
    workerId: number,
    addPosIds: number[],
    deletePosIds: number[],
  ): Promise<any>;
}
