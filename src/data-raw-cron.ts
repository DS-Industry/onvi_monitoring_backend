import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from '@exception/exception.filter';
import { DataRawCronModule } from "./data-raw-cron.module";

async function bootstrap() {
  const app = await NestFactory.create(DataRawCronModule);
  const configService = app.get(ConfigService);

  const appNameDataRawCron = configService.get<string>(
    'appNameDataRawCron',
  );
  const portCron = configService.get<number>('portCron');


  app.useGlobalFilters(new AllExceptionFilter());

  app.enableShutdownHooks();
  await app.listen(portCron);
  console.log(`Application ${appNameDataRawCron} ready port ${portCron}`);
}
bootstrap();
