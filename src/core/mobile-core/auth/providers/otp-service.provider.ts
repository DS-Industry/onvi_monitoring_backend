import { Provider } from '@nestjs/common';
import { IOtpService } from '../interfaces/otp-service';
import { RedisOtpService } from '../services/redis-otp.service';

export const OtpServiceProvider: Provider = {
  provide: IOtpService,
  useClass: RedisOtpService,
};
