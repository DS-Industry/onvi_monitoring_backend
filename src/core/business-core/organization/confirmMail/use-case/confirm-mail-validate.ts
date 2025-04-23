import { Injectable } from '@nestjs/common';
import { IDateAdapter } from '@libs/date/adapter';
import { OTP_EXPIRY_TIME } from '@constant/constants';
import { IOrganizationConfirmMailRepository } from '../interfaces/confirmMail';
import { OrganizationConfirmMail } from '@organization/confirmMail/domain/confirmMail';
import { StatusDeviceDataRaw } from '@prisma/client';

@Injectable()
export class ValidateOrganizationConfirmMailUseCase {
  constructor(
    private readonly organizationConfirmMailRepository: IOrganizationConfirmMailRepository,
    private readonly dateService: IDateAdapter,
  ) {}

  async execute(confirmString: string): Promise<OrganizationConfirmMail> {
    const currentConfirmMail =
      await this.organizationConfirmMailRepository.findOneByConfirmString(
        confirmString,
      );
    if (
      !currentConfirmMail ||
      this.dateService.isExpired(
        currentConfirmMail.expireDate,
        OTP_EXPIRY_TIME,
      ) ||
      currentConfirmMail.status != StatusDeviceDataRaw.PENDING
    ) {
      return null;
    }

    return currentConfirmMail;
  }
}
