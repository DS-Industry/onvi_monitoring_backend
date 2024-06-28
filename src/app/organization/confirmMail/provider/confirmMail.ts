import { Provider } from '@nestjs/common';
import { IOrganizationConfirmMailRepository } from '@organization/confirmMail/interfaces/confirmMail';
import { OrganizationConfirmMailRepository } from '@organization/confirmMail/repository/confirmMail';

export const OrganizationConfirmMailProvider: Provider = {
  provide: IOrganizationConfirmMailRepository,
  useClass: OrganizationConfirmMailRepository,
};
