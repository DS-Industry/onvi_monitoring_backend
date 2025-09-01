import {
  INVALID_ACCESS_AUTHENTIFICATION_ERROR_CODE,
  INVALID_OTP_AUTHENTIFICATION_ERROR_CODE,
  INVALID_REFRESH_AUTHENTIFICATION_ERROR_CODE,
} from '../constants';

class AuthenticationException extends Error {
  public readonly type = 'api_authentication';
  public readonly innerCode;
  constructor(innerCode: number, message: string) {
    super(message);
    this.innerCode = innerCode;
  }
}

export class InvalidOtpException extends AuthenticationException {
  constructor(phone: string) {
    super(
      INVALID_OTP_AUTHENTIFICATION_ERROR_CODE,
      `Client ${phone} invalid otp code`,
    );
  }
}

export class InvalidRefreshException extends AuthenticationException {
  constructor(phone: string) {
    super(
      INVALID_REFRESH_AUTHENTIFICATION_ERROR_CODE,
      `Client ${phone} invalid refresh token`,
    );
  }
}

export class InvalidAccessException extends AuthenticationException {
  constructor(phone: string) {
    super(
      INVALID_ACCESS_AUTHENTIFICATION_ERROR_CODE,
      `Client ${phone} invalid access token`,
    );
  }
}
