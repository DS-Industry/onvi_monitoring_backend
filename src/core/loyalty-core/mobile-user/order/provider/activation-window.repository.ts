import { Provider } from '@nestjs/common';
import { IActivationWindowRepository } from '../interface/activation-window-repository.interface';
import { ActivationWindowRepository } from '../repository/activation-window.repository';

export const ActivationWindowRepositoryProvider: Provider = {
  provide: IActivationWindowRepository,
  useClass: ActivationWindowRepository,
};

