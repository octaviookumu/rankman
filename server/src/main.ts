import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './polls/adapter/socket-io-adapter';
import { VIABLE_URLS } from './common/constants';

async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT'));
  const clientPort = parseInt(configService.get('CLIENT_PORT'));

  console.log('VIABLE_URLS', VIABLE_URLS);

  app.enableCors({
    origin: [
      'https://rankman-client.vercel.app',
      'https://rankman-client.vercel.app/polls',
      'https://rankman-client-git-fixer-octaviookumu.vercel.app',
    ],
    allowedHeaders: ['Content-Type', 'Authorization', 'Deez Nuts'],
  });
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}
bootstrap();
