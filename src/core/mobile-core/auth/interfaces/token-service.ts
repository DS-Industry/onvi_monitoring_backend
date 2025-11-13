import {
  TokenPayload,
  TokenPair,
  AccessToken,
  RefreshToken,
} from '../domain/token-pair';

export abstract class ITokenService {
  abstract generateTokens(payload: TokenPayload): Promise<TokenPair>;
  abstract generateAccessToken(payload: TokenPayload): Promise<AccessToken>;
  abstract generateRefreshToken(payload: TokenPayload): Promise<RefreshToken>;
  abstract validateAccessToken(token: string): Promise<TokenPayload>;
  abstract validateRefreshToken(token: string): Promise<TokenPayload>;
  abstract refreshTokens(refreshToken: string): Promise<TokenPair>;
}
