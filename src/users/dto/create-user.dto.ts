import { IsString, IsEmail, IsDate, Length, IsOptional } from 'class-validator';
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
  @IsString()
  readonly gender: string;

  @IsDate()
  dateOfBirth: Date;

  /**
   * @todo validate enums type properly
   */
  @IsString()
  maritalStatus: string;

  @IsString()
  nationality: string;

  @IsString()
  @Length(6, 500)
  @Exclude({ toPlainOnly: true })
  password: string;

  @IsString()
  authType: string;

  @IsString()
  verification: string;
}
