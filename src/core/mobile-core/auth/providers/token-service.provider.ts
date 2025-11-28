import { Provider } from '@nestjs/common';
import { ITokenService } from '../interfaces/token-service';
import { JwtTokenService } from '../services/jwt-token.service';

export const TokenServiceProvider: Provider = {
  provide: ITokenService,
  useClass: JwtTokenService,
};
