import { UserException } from './option.exceptions';
import { ValidationError } from '@nestjs/common';

export const VALIDATION_ERROR_CODE = 40;

export class ValidationException extends UserException {
  constructor(errors: ValidationError[]) {
    const errorMessage = errors
      .map((error) => Object.values(error.constraints))
      .join(', ');
    super(VALIDATION_ERROR_CODE, errorMessage);
  }
}
