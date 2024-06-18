import { Injectable } from '@nestjs/common';
import { IConfirmMailRepository } from '@platform-admin/confirmMail/interfaces/confirmMail';
import { IDateAdapter } from '@libs/date/adapter';
import { OTP_EXPIRY_TIME } from '@constant/constants';

@Injectable()
export class ValidateConfirmMailUseCase {
  constructor(
    private readonly confirmMailRepository: IConfirmMailRepository,
    private readonly dateService: IDateAdapter,
  ) {}

  async execute(email: string, confirmString: string): Promise<boolean> {
    const currentConfirmMail = await this.confirmMailRepository.findOne(email);
    return !(
      !currentConfirmMail ||
      this.dateService.isExpired(
        currentConfirmMail.expireDate,
        OTP_EXPIRY_TIME,
      ) ||
      currentConfirmMail.confirmString != confirmString
    );
  }
}
