import Container from 'typedi';

import { EmailService } from '../api/services/EmailService';
import { Logger } from '../lib/logger';

export const SendEmailJob = async (job: any, done: any) => {
  const log = new Logger(__filename);
  const emailService = Container.get<EmailService>(EmailService);
  const { data } = job.attrs;
  log.verbose(`sending email "${data.subject}" to "${data.to}"`);
  try {
    await emailService.send(data);
    return done();
  } catch (e) {
    log.error(`ERROR while sending email "${data.subject}" to "${data.to}", error= ${e.stack}`);
    return done(e);
  }
};

export const SendEmailJobName = 'SendEmail';
export const SendEmailJobDefinition = [SendEmailJobName, {}, SendEmailJob];
