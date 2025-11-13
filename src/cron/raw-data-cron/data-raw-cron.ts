import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from '@exception/exception.filter';
import { CronModule } from './cron.module';

async function bootstrap() {
  const app = await NestFactory.create(CronModule);
  const configService = app.get(ConfigService);

  const appNameCron = configService.get<string>('appNameCron');
  const portCron = configService.get<number>('portCron');

  app.useGlobalFilters(new AllExceptionFilter());

  app.enableShutdownHooks();
  await app.listen(portCron);
  console.log(`Application ${appNameCron} ready port ${portCron}`);
}
bootstrap();
