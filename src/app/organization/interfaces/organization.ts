import { Organization } from '@organization/domain/organization';

export abstract class IOrganizationRepository {
  abstract create(input: Organization): Promise<Organization>;
  abstract findOneById(id: number): Promise<Organization>;
  abstract findAll(): Promise<Organization[]>;
  abstract update(id: number, input: Organization): Promise<Organization>;
}
