import { UserInfofromToken } from './auth.interface';

export interface AccountConfirmationEmailJob {
  token: string;
  user: UserInfofromToken;
}
