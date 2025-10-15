import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodError } from '@pawpal/shared';

const STATUS_CODE = 422;

@Catch(ZodError)
export class ZodFilter<T extends ZodError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(422).json({
      errors: JSON.parse(exception.message),
      statusCode: STATUS_CODE,
    });
  }
}
