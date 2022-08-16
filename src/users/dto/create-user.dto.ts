import {
  IsString,
  IsEmail,
  IsDate,
  Length,
  IsOptional,
  Matches,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  readonly firstname: string;

  @IsString()
  readonly lastname: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  /**You might want to be flexble about this to accomodate  */
  @IsOptional()
  @IsString()
  readonly gender: string;

  @IsOptional()
  @IsDate()
  dateOfBirth: Date;

  /**
   * @todo validate enums type properly
   */
  @IsOptional()
  @IsString()
  maritalStatus: string;

  @IsOptional()
  @IsString()
  nationality: string;

  @IsString()
  @Length(6, 500)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*;])(?=.{8,})/, {
    message:
      'Weak Password! password must contain 1 capital letter, 1 special character and 1 number',
  })
  @Exclude({ toPlainOnly: true })
  password: string;
}
