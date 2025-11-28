import { ClientSession } from '../domain/client-session';

export abstract class IClientAuthRepository {
  abstract findSessionByClientId(clientId: number): Promise<ClientSession>;
  abstract findSessionByPhone(phone: string): Promise<ClientSession>;
  abstract createSession(session: ClientSession): Promise<ClientSession>;
  abstract updateSession(session: ClientSession): Promise<ClientSession>;
  abstract deleteSession(clientId: number): Promise<void>;
  abstract findActiveSessionByRefreshToken(
    refreshToken: string,
  ): Promise<ClientSession>;
}
