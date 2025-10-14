import { Injectable } from '@nestjs/common';
import { FindMethodsWorkerUseCase } from '@hr/worker/use-case/worker-find-methods';
import { IWorkerRepository } from '@hr/worker/interface/worker';

@Injectable()
export class ConnectionWorkerPosUseCase {
  constructor(
    private readonly findMethodsWorkerUseCase: FindMethodsWorkerUseCase,
    private readonly workerRepository: IWorkerRepository,
  ) {}

  async execute(posIds: number[], workerId: number) {
    const existingWorker = await this.findMethodsWorkerUseCase.getById(workerId);
    if (!existingWorker) {
      throw new Error('Worker not found');
    }

    const existingPoses = await this.workerRepository.findPosesByWorkerId(workerId);
    const existingPosIds = existingPoses.map((pos) => pos.id);

    const deletePosIds = existingPosIds.filter((id) => !posIds.includes(id)); 
    const addPosIds = posIds.filter((id) => !existingPosIds.includes(id));

    await this.workerRepository.updateConnectionPos(
      workerId,
      addPosIds,
      deletePosIds,
    );
    
    return { status: 'SUCCESS' };
  }
}
