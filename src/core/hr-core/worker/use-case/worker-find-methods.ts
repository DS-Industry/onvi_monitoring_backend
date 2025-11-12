import { Injectable } from '@nestjs/common';
import { IWorkerRepository } from '@hr/worker/interface/worker';
import { Worker } from '@hr/worker/domain/worker';
import { PaymentType } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class FindMethodsWorkerUseCase {
  constructor(private readonly workerRepository: IWorkerRepository) {}

  async getById(id: number): Promise<Worker> {
    return await this.workerRepository.findOneById(id);
  }

  async getAllByFilter(data: {
    user: User;
    placementId?: number;
    hrPositionId?: number;
    organizationId?: number;
    name?: string;
    skip?: number;
    take?: number;
    posId?: number;
    search?: string;
  }): Promise<Worker[]> {
    return await this.workerRepository.findAllByFilter(
      data.user.id,
      data.placementId,
      data.hrPositionId,
      data.organizationId,
      data.name,
      data.skip,
      data.take,
      data.posId,
      data.search,
    );
  }

  async getAllByFilterCount(data: {
    user: User;
    placementId?: number;
    hrPositionId?: number;
    organizationId?: number;
    name?: string;
    posId?: number;
    search?: string;
  }): Promise<number> {
    return await this.workerRepository.findAllByFilterCount(
      data.user.id,
      data.placementId,
      data.hrPositionId,
      data.organizationId,
      data.name,
      data.posId,
      data.search,
    );
  }

  async getAllForCalculatePayment(data: {
    user: User;
    organizationId: number;
    billingMonth: Date;
    hrPositionId?: number;
    paymentType?: PaymentType;
  }): Promise<Worker[]> {
    return await this.workerRepository.findAllForCalculatePayment(
      data.user.id,
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
