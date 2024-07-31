import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ILoggerAdapter } from '../src/infra/logger/adapter';
import { ISecretsAdapter } from '../src/infra/secrets/adapter';
import { ExceptionFilter } from '../src/observables/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('port');
  const appName = configService.get<string>('appName');

  const loggerService = app.get(ILoggerAdapter);

  loggerService.setApplication('');
  app.useLogger(loggerService);

  app.useGlobalFilters(new ExceptionFilter(loggerService));

  // app.useGlobalInterceptors(
  //   new RequestTimeoutInterceptor(new Reflector(), loggerService),
  //   new ExceptionInterceptor(),
  //   new HttpLoggerInterceptor(loggerService),
  //   new TracingInterceptor(loggerService),
  //   new MetricsInterceptor(),
  // );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new Error(
          errors.map((error) => Object.values(error.constraints)).join(', '),
        );
      },
    }),
  );

  app.enableShutdownHooks();
  await app.listen(PORT);
  console.log(
    `Application ${appName} ready to receive request in PORT - ${PORT}`,
  );
}
bootstrap();
