import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseException } from '@infra/exceptions/base.exception';
import { CustomHttpException } from '@infra/exceptions/custom-http.exception';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BaseException) {
          throw new CustomHttpException({
            type: error.type,
            innerCode: error.innerCode,
            message: error.message,
            code: error.getHttpStatus(),
          });
        }
        return throwError(() => error);
      }),
    );
  }
}
