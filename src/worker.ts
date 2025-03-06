import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from '@exception/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);
  const configService = app.get(ConfigService);

  const portWorker = configService.get<number>('portWorker');
  const appNameWorker = configService.get<string>('appNameWorker');

  app.useGlobalFilters(new AllExceptionFilter());

  app.enableShutdownHooks();
  await app.listen(portWorker);
  console.log(
    `Application ${appNameWorker} ready to receive request in PORT - ${portWorker}`,
  );
}
bootstrap();
