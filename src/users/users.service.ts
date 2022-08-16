import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigType } from '@nestjs/config';
import applicationConfig from 'src/config/app.config';
import { User } from './entities/user.enity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userRepository: Model<User>,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = new this.userRepository(createUserDto);
    return user.save();
  }

  async confirmUser(userInfo) {
    const user = await this.userRepository
      .findOneAndUpdate(
        { _id: userInfo.id },
        { $set: { active: true } },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('unable to find user');
    }
  }
  async getUserFromEmail(email: string) {}

  // async updateUserPassword(email);
}
