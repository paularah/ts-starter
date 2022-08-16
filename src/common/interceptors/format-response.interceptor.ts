import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Formats response paylaod into standard Jsend format  {success: true, data: {}}
 * https://github.com/omniti-labs/jsend
 * https://jsonapi.org/
 * @todo acocunt for pagination and next links
 */

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map((data) => ({ success: true, data })));
  }
}
