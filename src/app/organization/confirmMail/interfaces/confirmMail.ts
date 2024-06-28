import { OrganizationConfirmMail } from '@organization/confirmMail/domain/confirmMail';

export abstract class IOrganizationConfirmMailRepository {
  abstract create(
    input: OrganizationConfirmMail,
  ): Promise<OrganizationConfirmMail>;
  abstract findOne(email: string): Promise<OrganizationConfirmMail>;
  abstract removeOne(email: string): Promise<void>;
}
