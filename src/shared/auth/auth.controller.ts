import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/users/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiProperty({})
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUserAcount(createUserDto);
  }
}
