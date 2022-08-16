import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './shared/auth/auth.module';
import { EmailModule } from './shared/emails/email.module';
import applicationConfig from './config/app.config';

/**
 * @todo object validation for all env variables
 * @use async configuration and inject config service
 */

@Module({
  imports: [
    UsersModule,
    AuthModule,
    EmailModule,
    ConfigModule.forRoot({
      load: [applicationConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'staging')
          .default('development'),
        PORT: Joi.number().default(3000),
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
