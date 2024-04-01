import { PassportStrategy } from '@nestjs/passport';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'phone',
      otpField: 'otp',
    });
  }

  async validate(
    phone: string,
    otp: string,
    done: (error: Error, data) => Record<string, unknown>,
  ) {}
}
