import { Provider } from '@nestjs/common';
import { IOtpRepository } from '@mobile-user/otp/interfaces/otp';
import { OtpRepository } from '@mobile-user/otp/repository/otp';

export const OtpRepositoryProvider: Provider = {
  provide: IOtpRepository,
  useClass: OtpRepository,
};
