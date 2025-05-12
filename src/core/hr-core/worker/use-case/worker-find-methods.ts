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

  async getAllForCalculatePayment(
    organizationId: number,
    billingMonth: Date,
    hrPositionId: number | '*',
    paymentType: PaymentType | '*',
  ): Promise<Worker[]> {
    let hrPositionIdCorrect = undefined;
    let paymentTypeCorrect = undefined;
    if (hrPositionId != '*') {
      hrPositionIdCorrect = hrPositionId;
    }
    if (paymentType != '*') {
      paymentTypeCorrect = paymentType;
    }

    return await this.workerRepository.findAllForCalculatePayment(
      organizationId,
      billingMonth,
      hrPositionIdCorrect,
      paymentTypeCorrect,
    );
  }

  async getAllByIds(ids: number[]): Promise<Worker[]> {
    return await this.workerRepository.findAllByIds(ids);
  }
}
