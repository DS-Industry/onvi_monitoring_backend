import { Provider } from '@nestjs/common';
import { IWorkerRepository } from '@hr/worker/interface/worker';
import { WorkerRepository } from '@hr/worker/repository/worker';

export const WorkerRepositoryProvider: Provider = {
  provide: IWorkerRepository,
  useClass: WorkerRepository,
};
