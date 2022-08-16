import {
  Process,
  Processor,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueActive,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

import {
  ResetPasswordEmail,
  ConfirmationEmail,
} from 'src/common/constants/mailer.constant';

import { AccountConfirmationEmailJob } from 'src/common/interfaces/mailer.interface';

@Processor('mails')
export class EmailConsumer {
  private readonly logger = new Logger(EmailConsumer.name);

  constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(ConfirmationEmail)
  processUserAccountConfirmationEmail(job: Job<AccountConfirmationEmailJob>) {
    this.mailerService.sendMail({
      to: job.data.user.email,
      html: ``,
    });
  }

  // @Process(ResetPasswordEmail)
  // procesUserPasswordResetEmail() {}
}
