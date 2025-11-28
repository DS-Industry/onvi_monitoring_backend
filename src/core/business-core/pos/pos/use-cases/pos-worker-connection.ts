import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { FindMethodsWorkerUseCase } from '@hr/worker/use-case/worker-find-methods';

@Injectable()
export class ConnectionPosWorkerUseCase {
  constructor(
    private readonly posRepository: IPosRepository,
    private readonly findMethodsWorkerUseCase: FindMethodsWorkerUseCase,
  ) {}

  async execute(workerIds: number[], posId: number) {
    const existingWorkers =
      await this.findMethodsWorkerUseCase.getAllByPosId(posId);
    const existingWorkerIds = existingWorkers.map((pos) => pos.id);

    const deleteWorkerIds = existingWorkerIds.filter(
      (id) => !workerIds.includes(id),
    );
    const addWorkerIds = workerIds.filter(
      (id) => !existingWorkerIds.includes(id),
    );

    await this.posRepository.updateConnectionWorker(
      posId,
      addWorkerIds,
      deleteWorkerIds,
    );
    return { status: 'SUCCESS' };
  }
}
