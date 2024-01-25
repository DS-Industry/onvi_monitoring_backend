import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: configService.get<string>('databaseUrl'),
      },
    },
  });
  await app.listen(3000);
}
bootstrap();
