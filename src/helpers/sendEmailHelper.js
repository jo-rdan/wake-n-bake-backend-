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
    <p>Click on this <a href=${process.env.BASE_URL}api/V1/users/email/verify/${token}>link</a> to verify your account</p><p>This link will be valid for 5 minutes</p>`,
  };

  sgMail.send(msg);
};

export default sendEmail;
