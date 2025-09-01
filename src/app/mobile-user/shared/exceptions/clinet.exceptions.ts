import {
  CLIENT_EXISTS_CLIENT_EXCEPTION_CODE,
  CLIENT_META_EXISTS_EXCEPTION_CODE,
  CLIENT_META_NOT_FOUND_EXCEPTION_CODE,
  CLIENT_NOT_FOUND_EXCEPTION_CODE,
} from '../constants';

class ClientException extends Error {
  public readonly type = 'api_client';
  public readonly innerCode;
  constructor(innerCode: number, message: string) {
    super(message);
    this.innerCode = innerCode;
  }
}

export class ClientExistsException extends ClientException {
  constructor(phone: string) {
    super(
      CLIENT_EXISTS_CLIENT_EXCEPTION_CODE,
      `Client phone= ${phone} already exists`,
    );
  }
}

export class ClientNotFoundExceptions extends ClientException {
  constructor(phone: string) {
    super(
      CLIENT_NOT_FOUND_EXCEPTION_CODE,
      `Client with phone= ${phone} is not found`,
    );
  }
}

export class ClientMetaExistsExceptions extends ClientException {
  constructor(clientId: number) {
    super(
      CLIENT_META_EXISTS_EXCEPTION_CODE,
      `Metadata clientId= ${clientId} already exists`,
    );
  }
}

export class ClientMetaNotFoundExceptions extends ClientException {
  constructor(metaId: number) {
    super(
      CLIENT_META_NOT_FOUND_EXCEPTION_CODE,
      `Metadata metaId= ${metaId} is not found`,
    );
  }
}
