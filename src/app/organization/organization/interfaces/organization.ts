import { Organization } from '@organization/organization/domain/organization';
import { User } from '@platform-user/user/domain/user';

export abstract class IOrganizationRepository {
  abstract create(input: Organization): Promise<Organization>;
  abstract findOneById(id: number): Promise<Organization>;
  abstract findOneByName(name: string): Promise<Organization>;
  abstract findOneBySlug(slug: string): Promise<Organization>;
  abstract findAll(): Promise<Organization[]>;
  abstract findAllClient(id: number): Promise<User[]>;
  abstract update(id: number, input: Organization): Promise<Organization>;
}
