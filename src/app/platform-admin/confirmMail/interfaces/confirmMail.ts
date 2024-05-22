import { ConfirmMail } from '@platform-admin/confirmMail/domain/confirmMail';

export abstract class IConfirmMailRepository {
  abstract create(input: ConfirmMail): Promise<ConfirmMail>;
  abstract findOne(email: string): Promise<ConfirmMail>;
  abstract removeOne(email: string): Promise<void>;
}
