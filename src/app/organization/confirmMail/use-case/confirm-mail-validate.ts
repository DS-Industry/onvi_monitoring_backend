import { Injectable } from '@nestjs/common';
import { IDateAdapter } from '@libs/date/adapter';
import { OTP_EXPIRY_TIME } from '@constant/constants';
import { IOrganizationConfirmMailRepository } from '@organization/confirmMail/interfaces/confirmMail';

@Injectable()
export class ValidateOrganizationConfirmMailUseCase {
  constructor(
    private readonly organizationConfirmMailRepository: IOrganizationConfirmMailRepository,
    private readonly dateService: IDateAdapter,
  ) {}

  async execute(email: string, confirmString: string): Promise<number> {
    const currentConfirmMail =
      await this.organizationConfirmMailRepository.findOne(email);
    if (
      !currentConfirmMail ||
      this.dateService.isExpired(
        currentConfirmMail.expireDate,
        OTP_EXPIRY_TIME,
      ) ||
      currentConfirmMail.confirmString != confirmString
    ) {
      return null;
    }

    return currentConfirmMail.organizationId;
  }
}
