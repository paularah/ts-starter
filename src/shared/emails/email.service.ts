import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

import {
  EmailEvents,
  ConfirmationEmail,
} from 'src/common/constants/mailer.constant';
import { UserInfofromToken } from 'src/common/interfaces/auth.interface';

/**
 * the mailer service takes in a vendor service with a predefined interface
 * all vendors must subscribe to. This allow to abstract vendor-specific email sending implementations
 * You can easily swap for a smtp vendor, transacion email api like sengrid, SES,
 * or a multichanel notification service.
 * @todo abstract class for vendors
 */

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(@InjectQueue('mails') private mailQueue: Queue) {}

  async enQueueMail(type: EmailEvents, job) {
    this.logger.log(`${type} job for ${job.user.email} added to queue`);
    this.mailQueue.add(type, job);
  }

  async sendAccountConfirmationEmail(token: string, user: UserInfofromToken) {
    await this.enQueueMail(ConfirmationEmail, {
      token,
      user,
    });
  }
}
