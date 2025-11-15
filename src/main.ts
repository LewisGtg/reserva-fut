import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = configService.get<number>('app.port', 3000);
  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');

  await app.listen(port);

  const logger = new Logger('Bootstrap');

  const secretKey = configService.get<string | undefined>('app.secretKey');
  if (!secretKey) {
    throw new Error('SECRET_KEY is not defined in environment variables.');
  }

  logger.log(
    `Application running on http://localhost:${port} in ${nodeEnv} mode`,
  );
}

void bootstrap();
