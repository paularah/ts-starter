import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { EmailService } from 'src/shared/emails/email.service';
import { UserInfofromToken } from 'src/common/interfaces/auth.interface';

const EMAIL_TTL = 1000000;

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async createUserAccountConfirmationToken(userInfo: UserInfofromToken) {
    const token = nanoid();
    this.redis.setex(token, EMAIL_TTL, JSON.stringify(userInfo));
    return token;
  }

  async getUserAccountConfirmationToken(token: string) {
    const userInfo = this.redis.get(token);
  }

  //   async createUserPasswordResetToken() {}

  //   async getUserPasswordResetToken() {}

  async registerUserAcount(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    const userinfo = {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
    };
    const activationToken = await this.createUserAccountConfirmationToken(
      userinfo,
    );
    this.emailService.sendAccountConfirmationEmail(activationToken, userinfo);
    return { token: activationToken };
  }

  //   async loginUser() {}

  //   async verifyUserLogin() {}
}
