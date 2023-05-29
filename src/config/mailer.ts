import * as Mailer from 'nodemailer';
import { appEmail, appEmailPass } from './envVars';

export const transport = Mailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: appEmail,
    pass: appEmailPass,
  },
});
