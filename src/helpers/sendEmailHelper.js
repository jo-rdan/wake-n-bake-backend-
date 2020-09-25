import sgMail from "@sendgrid/mail";
import { config } from "dotenv";

config();

const sendEmail = (recipient, token) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: recipient,
    from: "wakenbakeapp@gmail.com",
    subject: "Verify your email on wake n bake",
    html: `<strong>Thank you for starting your new happy moments with us</strong>
    <p>Click on this <a href=http://localhost:3000/api/V1/email/verify/${token}>link</a> to verify your account</p>`,
  };

  sgMail.send(msg);
};

export default sendEmail;
