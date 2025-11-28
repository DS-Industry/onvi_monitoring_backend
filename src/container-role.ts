// src/bootstrap.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from '@exception/exception.filter';
import { ReportWorkerModule } from './workers/report-worker/report-worker.module';
import { DataRawWorkerModule } from './workers/data-raw-worker/data-raw-worker.module';
import { CronModule } from './cron/raw-data-cron/cron.module';
import { PaymentOrchestratorModule } from './workers/payment-orchestrator/payment-orchestrator.module';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as express from 'express';

export const rolesMapBootstrap = {
  app: async () => {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const PORT = configService.get<number>('port');
    const appName = configService.get<string>('appName');

    app.enableCors({
      origin: [
        'http://localhost:5173',
        'https://ds-industry.github.io',
        'https://app.onvione.ru',
        'https://st.app.onvione.ru',
      ],
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204, 
    });

    app.use(cookieParser());

    app.use(
      '/payment-webhook/webhook',
      express.raw({ type: 'application/json', limit: '10mb' }),
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        (req as any).rawBody = req.body;
        try {
          (req as any).body = JSON.parse(req.body.toString('utf8'));
        } catch (e) {
          return next(new Error('Invalid JSON in request body'));
        }
        next();
      },
    );

    // CSRF Protection temporarily disabled due to deprecated csurf package issues
    // TODO: Implement modern CSRF protection

    app.useGlobalFilters(new AllExceptionFilter());

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
    return app;
  },

  reportWorker: async () => {
    const app = await NestFactory.create(ReportWorkerModule);
    const configService = app.get(ConfigService);

    const appNameReportWorker = configService.get<string>(
      'appNameReportWorker',
    );
    const portWorkerReport = configService.get<number>('portWorkerReport');

    app.useGlobalFilters(new AllExceptionFilter());
    app.enableShutdownHooks();
    await app.listen(portWorkerReport);

    console.log(`Application ${appNameReportWorker} ready`);
    return app;
  },

  dataRawWorker: async () => {
    const app = await NestFactory.create(DataRawWorkerModule);
    const configService = app.get(ConfigService);

    const appNameDataRawWorker = configService.get<string>(
      'appNameDataRawWorker',
    );
    const portWorkerDataRaw = configService.get<number>('portWorkerDataRaw');

    app.useGlobalFilters(new AllExceptionFilter());
    app.enableShutdownHooks();
    await app.listen(portWorkerDataRaw);

    console.log(`Application ${appNameDataRawWorker} ready`);
    return app;
  },

  cron: async () => {
    const app = await NestFactory.create(CronModule);
    const configService = app.get(ConfigService);

    const appNameCron = configService.get<string>('appNameCron');
    const portCron = configService.get<number>('portCron');

    app.useGlobalFilters(new AllExceptionFilter());
    app.enableShutdownHooks();

    await app.listen(portCron);
    console.log(`Application ${appNameCron} ready port ${portCron}`);
    return app;
  },

  paymentOrchestrator: async () => {
    const app = await NestFactory.create(PaymentOrchestratorModule);
    const configService = app.get(ConfigService);

    const appName = configService.get<string>('appNamePaymentOrchestrator');
    const port = configService.get<number>('portPaymentOrchestrator');

    app.useGlobalFilters(new AllExceptionFilter());
    app.enableShutdownHooks();
    await app.listen(port);
    console.log(`Application ${appName} ready`);
    return app;
  },
};
