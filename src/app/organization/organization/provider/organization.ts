import { Provider } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';
import { OrganizationRepository } from '@organization/organization/repository/organization';

export const OrganizationRepositoryProvider: Provider = {
  provide: IOrganizationRepository,
  useClass: OrganizationRepository,
};
