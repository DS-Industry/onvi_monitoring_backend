import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';
export class UserException extends BaseException {
  constructor(innerCode: number, message: string) {
    super('api_user', innerCode, message);
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}

export class DeviceException extends BaseException {
  constructor(innerCode: number, message: string) {
    super('api_device', innerCode, message);
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}

export class IncidentException extends BaseException {
  constructor(innerCode: number, message: string) {
    super('api_incident', innerCode, message);
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}

export class OrganizationException extends BaseException {
  constructor(innerCode: number, message: string) {
    super('api_organization', innerCode, message);
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}

export class PosException extends BaseException {
  constructor(innerCode: number, message: string) {
    super('api_pos', innerCode, message);
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}

export class TechTaskException extends BaseException {
  constructor(innerCode: number, message: string) {
    super('api_techTask', innerCode, message);
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}

export class WarehouseException extends BaseException {
  constructor(innerCode: number, message: string) {
    super('api_warehouse', innerCode, message);
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}

export class FinanceException extends BaseException {
  constructor(innerCode: number, message: string) {
    super('api_finance', innerCode, message);
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}

export class WarehouseDomainException extends BaseException {
  constructor(innerCode: number, message: string) {
    super('domain_warehouse', innerCode, message);
  }

  getHttpStatus(): number {
    return HttpStatus.CONFLICT;
  }
}