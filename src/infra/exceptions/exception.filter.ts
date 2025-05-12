import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { ValidationException } from './validation.exception';
import { CustomHttpException } from './custom-http.exception';
import { SERVER_ERROR } from '@constant/error.constants';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: any, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception instanceof ValidationException
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof CustomHttpException
        ? {
            type: exception.type,
            innerCode: exception.innerCode,
            message: exception.getResponse().toString(),
          }
        : exception instanceof ValidationException
          ? {
              type: exception.type,
              innerCode: exception.innerCode,
              message: exception.message,
            }
          : {
              type: 'api_server',
              innerCode: SERVER_ERROR,
              message: (exception as Error).message,
            };
    const message = errorResponse.message;

    const error = {
      code: errorResponse.innerCode,
      type: errorResponse.type,
      message,
    };

    const responseData = {
      ...error,
      ...{
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    console.log(exception);
    response.status(status).json(responseData);
  }
}
