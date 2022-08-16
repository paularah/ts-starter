import { IsString } from 'class-validator';

export class ConfirmUserAccountDto {
  @IsString()
  token: string;
}
