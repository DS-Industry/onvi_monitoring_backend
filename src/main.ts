import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ILoggerAdapter } from "./infra/logger";
import { ExceptionFilter } from "./observables/filters";
import { AllExceptionFilter } from "./infra/exceptions/exception.filter";

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, {
  //   bufferLogs: true,
  //   cors: true,
  // });

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('port');
  const appName = configService.get<string>('appName');

  const loggerService = await app.resolve(ILoggerAdapter);

  loggerService.connect();
  loggerService.setApplication('');
  app.useLogger(loggerService);

  app.useGlobalFilters(new AllExceptionFilter());
  /*
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://d5dgrl80pu15j74ov536.apigw.yandexcloud.net',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // if you need to send cookies or credentials,
    allowedHeaders: 'Content-Type, Accept',
  });
*/
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
