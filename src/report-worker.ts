import { NestFactory } from '@nestjs/core';
import { ReportWorkerModule } from './report-worker.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from '@exception/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ReportWorkerModule);
  const configService = app.get(ConfigService);

  const appNameReportWorker = configService.get<string>('appNameReportWorker');

  app.useGlobalFilters(new AllExceptionFilter());

  app.enableShutdownHooks();
  console.log(`Application ${appNameReportWorker} ready`);
}
bootstrap();
