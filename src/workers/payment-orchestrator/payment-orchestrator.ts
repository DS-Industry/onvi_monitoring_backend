import { NestFactory } from '@nestjs/core';
import { PaymentOrchestratorModule } from './payment-orchestrator.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from '@exception/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(PaymentOrchestratorModule);
  const configService = app.get(ConfigService);

  const appNamePaymentOrchestrator = configService.get<string>(
    'appNamePaymentOrchestrator',
  );
  const portWorkerPaymentOrchestrator = configService.get<number>(
    'portWorkerPaymentOrchestrator',
  );

  app.useGlobalFilters(new AllExceptionFilter());
  app.enableShutdownHooks();
  await app.listen(portWorkerPaymentOrchestrator);

  console.log(`Application ${appNamePaymentOrchestrator} ready`);
}
bootstrap();
