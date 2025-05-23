import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from '@exception/exception.filter';
import { DataRawWorkerModule } from './data-raw-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(DataRawWorkerModule);
  const configService = app.get(ConfigService);

  const appNameDataRawWorker = configService.get<string>(
    'appNameDataRawWorker',
  );
  const portWorker = configService.get<number>('portWorker');

  app.useGlobalFilters(new AllExceptionFilter());

  app.enableShutdownHooks();
  await app.listen(portWorker);
  console.log(`Application ${appNameDataRawWorker} ready`);
}
bootstrap();
