/* eslint-disable import/prefer-default-export */
import { Twilio } from 'twilio';
import { config } from 'dotenv';

config();

const client = new Twilio(
  process.env.TWILIO_ACCT_ID,
  process.env.TWILIO_ACCT_SECRET
);

export const sendSms = async (to, channel) => {
  await client.verify
    .services(process.env.TWILIO_SERVICE_SID)
    .verifications.create({ to: `+25${to}`, channel });
};

export const verifySmsCode = async (to, code) => {
  const verifyUser = await client.verify
    .services(process.env.TWILIO_SERVICE_SID)
    .verificationChecks.create({ to: `+25${to}`, code });
  return verifyUser;
};
