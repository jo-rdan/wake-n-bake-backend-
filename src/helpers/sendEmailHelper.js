import sgMail from "@sendgrid/mail";
import { config } from "dotenv";

config();

const sendEmail = (recipient, link, reason) => {
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

export default sendEmail;
