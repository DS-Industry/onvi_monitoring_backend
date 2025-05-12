import { Provider } from '@nestjs/common';
import { IOrganizationRepository } from '../interfaces/organization';
import { OrganizationRepository } from '../repository/organization';

export const OrganizationRepositoryProvider: Provider = {
  provide: IOrganizationRepository,
  useClass: OrganizationRepository,
};
