import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class CarWashUnavailableException extends BaseException {
  constructor(carWashId?: number) {
    super(
      'api_order',
      400,
      carWashId
        ? `Car wash ${carWashId} is currently unavailable`
        : 'Car wash is currently unavailable',
      { carWashId },
    );
  }

  getHttpStatus(): number {
    return HttpStatus.SERVICE_UNAVAILABLE;
  }
}



