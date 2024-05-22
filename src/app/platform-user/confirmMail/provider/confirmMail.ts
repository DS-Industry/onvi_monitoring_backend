import { Provider } from '@nestjs/common';
import { IConfirmMailRepository } from '@platform-user/confirmMail/interfaces/confirmMail';
import { ConfirmMailRepository } from '@platform-user/confirmMail/repository/confirmMail';

export const ConfirmMailProvider: Provider = {
  provide: IConfirmMailRepository,
  useClass: ConfirmMailRepository,
};
