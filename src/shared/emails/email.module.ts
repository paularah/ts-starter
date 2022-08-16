import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailConsumer } from './email.processor';
import { BullModule } from '@nestjs/bull';

/**
 * This module handles emails related task like reading templates from the
 * file system or a remote block storage source, schdueling reminder emails,
 * etc.
 * Vendor-specific implementation are placed in the /vendors directory.
 * You can swap bull queue for something like AWS SNS linked to lamdda f(x) that does
 * the actual sending of emails
 *
 * With bull, priority is given to emails in the order -> TOTP ->  tokens ->
 */

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mails',
    }),
  ],
  providers: [EmailService, EmailConsumer],
  exports: [EmailService],
})
export class EmailModule {}
