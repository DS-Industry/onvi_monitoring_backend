import { OrganizationConfirmMail } from '../domain/confirmMail';

export abstract class IOrganizationConfirmMailRepository {
  abstract create(
    input: OrganizationConfirmMail,
  ): Promise<OrganizationConfirmMail>;
  abstract findOne(email: string): Promise<OrganizationConfirmMail>;
  abstract findOneByConfirmString(
    confirmString: string,
  ): Promise<OrganizationConfirmMail>;
  abstract removeOne(email: string): Promise<void>;
  abstract update(
    input: OrganizationConfirmMail,
  ): Promise<OrganizationConfirmMail>;
}
