import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfirmUserAccountDto } from 'src/users/dto/confirm-user.dto';
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

  async inValidateUserToken(token: string) {
    await this.redis.del(token);
  }

  async getUserAccountConfirmationToken(
    token: string,
  ): Promise<string | undefined> {
    return JSON.parse(await this.redis.get(token));
  }

  //   async createUserPasswordResetToken() {}

  //   async getUserPasswordResetToken() {}

  async registerUserAcount(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    const userinfo = {
      id: user._id.toString(),
      email: user.email,
      firstname: user.firstname,
    };
    const activationToken = await this.createUserAccountConfirmationToken(
      userinfo,
    );
    this.emailService.sendAccountConfirmationEmail(activationToken, userinfo);
    return { token: activationToken };
  }

  async confirmUserRegistration(confirmUserAccountDto: ConfirmUserAccountDto) {
    const userInfo = await this.getUserAccountConfirmationToken(
      confirmUserAccountDto.token,
    );

    if (!userInfo) {
      throw new ConflictException('Invalid or expired link');
    }

    this.userService.confirmUser(userInfo);
    await this.inValidateUserToken(confirmUserAccountDto.token);
    return {};
  }

  //   async loginUser() {}

  //   async verifyUserLogin() {}
}
