import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from '../../src/common/interceptors/format-response.interceptor';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { MongooseExceptionFilter } from '../../src/common/filters/mongoose.filter';
import { AuthModule } from '../../src/shared/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import applicationConfig from '../../src/config/app.config';

describe('[User Authentication]     Auth - /auth/users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        UsersModule,
        ConfigModule.forRoot({
          envFilePath: `../`,
          load: [applicationConfig],
          expandVariables: true,
          validationSchema: Joi.object({
            NODE_ENV: Joi.string()
              .valid('development', 'production', 'test', 'staging')
              .default('testing'),
          }),
        }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        RedisModule.forRoot({
          config: {
            url: process.env.REDIS_URI,
          },
        }),
        BullModule.forRoot({
          url: process.env.REDIS_URI,
        }),
        MailerModule.forRoot({
          transport: process.env.SMTP_TRANSPORT,
          // defaults: {
          //   from: '"nest-modules" <modules@nestjs.com>',
          // },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

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
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
});
