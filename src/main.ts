import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as session from 'express-session';
import * as createRedisStore from 'connect-redis';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createClient } from 'redis';

import { AppModule } from './app.module';
import { MongooseExceptionFilter } from './common/filters/mongoose.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { FormatResponseInterceptor } from './common/interceptors/format-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new MongooseExceptionFilter());

  /**URI versioning on the controller, excluding liveness controllers */
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v1',
  });

  /**Global redis store for session data */
  const RedisStore = createRedisStore(session);
  const redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch(console.error);

  /**Automatic Open API spec from DTOs and controller decorators*/
  const options = new DocumentBuilder()
    .setTitle('Zcompany')
    .setDescription('Demo Rest API for Zcompany')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  /**Open API spec UI is mounted on the /docs route */
  SwaggerModule.setup('docs', app, document);

  /**security features and headers*/
  app.enableCors();
  app.use(helmet());
  app.use(helmet.hidePoweredBy());

  /**using redis as the session store*/
  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        httpOnly: true,
      },
      store: new RedisStore({ client: redisClient }),
    }),
  ),
    await app.listen(3000);
}
bootstrap();
