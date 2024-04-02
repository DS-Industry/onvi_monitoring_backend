import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationError, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('port');
  const appName = configService.get<string>('appName');

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

  await app.listen(PORT);
  console.log(
    `Application ${appName} ready to receive request in PORT - ${PORT}`,
  );
}
bootstrap();
