// src/bootstrap.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from '@exception/exception.filter';
import { ReportWorkerModule } from './workers/report-worker/report-worker.module';
import { DataRawWorkerModule } from './workers/data-raw-worker/data-raw-worker.module';
import { DataRawCronModule } from './cron/raw-data-cron/data-raw-cron.module';

export const rolesMapBootstrap = {
  app: async () => {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const PORT = configService.get<number>('port');
    const appName = configService.get<string>('appName');

    app.useGlobalFilters(new AllExceptionFilter());

    app.enableShutdownHooks();
    await app.listen(PORT);
    console.log(
      `Application ${appName} ready to receive request in PORT - ${PORT}`,
    );
    return app;
  },

  reportWorker: async () => {
    const app = await NestFactory.create(ReportWorkerModule);
    const configService = app.get(ConfigService);

    const appNameReportWorker = configService.get<string>(
      'appNameReportWorker',
    );

    app.useGlobalFilters(new AllExceptionFilter());
    app.enableShutdownHooks();

    console.log(`Application ${appNameReportWorker} ready`);
    return app;
  },

  dataRawWorker: async () => {
    const app = await NestFactory.create(DataRawWorkerModule);
    const configService = app.get(ConfigService);

    const appNameDataRawWorker = configService.get<string>(
      'appNameDataRawWorker',
    );

    app.useGlobalFilters(new AllExceptionFilter());
    app.enableShutdownHooks();

    console.log(`Application ${appNameDataRawWorker} ready`);
    return app;
  },

  dataRawCron: async () => {
    const app = await NestFactory.create(DataRawCronModule);
    const configService = app.get(ConfigService);

    const appNameDataRawCron = configService.get<string>('appNameDataRawCron');
    const portCron = configService.get<number>('portCron');

    app.useGlobalFilters(new AllExceptionFilter());
    app.enableShutdownHooks();

    await app.listen(portCron);
    console.log(`Application ${appNameDataRawCron} ready port ${portCron}`);
    return app;
  },
};
