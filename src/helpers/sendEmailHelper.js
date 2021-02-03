import sgMail from "@sendgrid/mail";
import { config } from "dotenv";

config();

export const sendEmail = (recipient, link, reason) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: recipient,
    from: "wakenbakeapp@gmail.com",
    subject:
      reason === "verify" ? "Verify your email on wake n bake" : "Reset Link",
    html:
      reason === "verify"
        ? `<strong>Thank you for starting your new happy moments with us</strong>
    <p>Click on this <a href=${process.env.BASE_URL}api/V1/users${link}>link</a> to verify your account</p><p>This link will be valid for 5 minutes</p>`
        : `<strong>Reset Link</strong>
    <p>Click on this <a href=${process.env.BASE_URL}${link}>link</a> to reset your password</p><p>This link will be valid for 5 minutes</p>`,
  };

  sgMail.send(msg);
};

export const sendEmailSubscriber = (to) => {
  sgMail.setApiKey(process.env.HEAVY_API_KEY);
  const message = {
    to,
    from: "heavyrwanda@gmail.com",
    subject: "Subscription on newsletter",
    html: `<strong>Thank you for suscribing on our newsletter</strong><br/><p>We will be sending updates of all on-going projects to this email. I you don't want to receive updates you can unsubscribe at any moment</p>`,
  };
  sgMail.send(message);
};
