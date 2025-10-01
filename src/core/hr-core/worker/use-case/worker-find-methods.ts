import { Injectable } from '@nestjs/common';
import { IWorkerRepository } from '@hr/worker/interface/worker';
import { Worker } from '@hr/worker/domain/worker';
import { PaymentType } from '@prisma/client';

@Injectable()
export class FindMethodsWorkerUseCase {
  constructor(private readonly workerRepository: IWorkerRepository) {}

  async getById(id: number): Promise<Worker> {
    return await this.workerRepository.findOneById(id);
  }

  async getAllByFilter(
    placementId?: number,
    hrPositionId?: number,
    organizationId?: number,
    name?: string,
    skip?: number,
    take?: number,
  ): Promise<Worker[]> {
    return await this.workerRepository.findAllByFilter(
      placementId,
      hrPositionId,
      organizationId,
      name,
      skip,
      take,
    );
  }

  async getAllByFilterCount(
    placementId?: number,
    hrPositionId?: number,
    organizationId?: number,
    name?: string,
  ): Promise<number> {
    return await this.workerRepository.findAllByFilterCount(
      placementId,
      hrPositionId,
      organizationId,
      name,
    );
  }

  async getAllForCalculatePayment(data: {
    organizationId: number;
    billingMonth: Date;
    hrPositionId?: number;
    paymentType?: PaymentType;
  }): Promise<Worker[]> {
    return await this.workerRepository.findAllForCalculatePayment(
      data.organizationId,
      data.billingMonth,
      data.hrPositionId,
      data.paymentType,
    );
  }

  async getAllByIds(ids: number[]): Promise<Worker[]> {
    return await this.workerRepository.findAllByIds(ids);
  }

  async getAllByPosId(posId: number): Promise<Worker[]> {
    return await this.workerRepository.findAllByPosId(posId);
  }

  async getPosesByWorkerId(workerId: number): Promise<any[]> {
    return await this.workerRepository.findPosesByWorkerId(workerId);
  }
}
