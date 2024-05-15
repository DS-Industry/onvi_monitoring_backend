import { Provider } from '@nestjs/common';
import { IConfirmMailRepository } from '@platform-admin/confirmMail/interfaces/confirmMail';
import { ConfirmMailRepository } from '@platform-admin/confirmMail/repository/confirmMail';

export const ConfirmMailProvider: Provider = {
  provide: IConfirmMailRepository,
  useClass: ConfirmMailRepository,
};
