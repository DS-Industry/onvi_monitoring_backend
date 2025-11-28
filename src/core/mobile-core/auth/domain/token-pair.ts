export interface TokenPayload {
  phone: string;
  clientId: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

export interface AccessToken {
  token: string;
  expirationDate: Date;
}

export interface RefreshToken {
  token: string;
  expirationDate: Date;
}
