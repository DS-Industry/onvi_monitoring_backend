import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    // Generate a unique ID
    const requestId = uuidv4();

    // Attach the unique ID to the request
    request.id = requestId;

    console.log(`Request ID: ${requestId}`);

    return next.handle();
  }
}
