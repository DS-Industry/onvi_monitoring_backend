import { Provider } from '@nestjs/common';
import { IOrganizationConfirmMailRepository } from '../interfaces/confirmMail';
import { OrganizationConfirmMailRepository } from '../repository/confirmMail';

export const OrganizationConfirmMailProvider: Provider = {
  provide: IOrganizationConfirmMailRepository,
  useClass: OrganizationConfirmMailRepository,
};
