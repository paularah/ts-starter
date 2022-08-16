/**
 * these constants are used to specifiy the kind of  email jobs to be queue
 */

export const ConfirmationEmail = 'CONFIRMATION_EMAIL';
export const ResetPasswordEmail = 'RESET_PASSWORD_EMAIL';
export const OtpEmail = 'OTP_EMAIL';

export type EmailEvents =
  | typeof ResetPasswordEmail
  | typeof OtpEmail
  | typeof ConfirmationEmail;
