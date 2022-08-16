import { Injectable } from '@nestjs/common';

/**vendor specific email sending implementation so that the main
 * mail service simply programs against a uniform interface.
 */
@Injectable()
export class SmtpEmailVendor {}
