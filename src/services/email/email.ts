import nodemailer from 'nodemailer';
import pug from 'pug';

const transporter = nodemailer.createTransport({
  host: 'ajuju-api.software',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const selectTemplateFromPurpose = ({ purpose, username }: { purpose: string; username: string }) => {
  if (purpose === 'welcome') {
    return pug.renderFile(`${process.cwd()}/welcome.pug`, { username });
  }
  return pug.renderFile(`${process.cwd()}/resetPassword.pug`, { username });
};

const sendEmail = async ({ recipientEmail, purpose, username }: { recipientEmail: string; purpose: string; username: string }) => {
  return transporter.sendMail({
    from: `"Ajuju" <${process.env.EMAIL}>`, // sender address
    to: recipientEmail, // list of receivers
    subject: purpose === 'welcome' ? 'Welcome to Ajuju' : 'Password Reset Confirmation', // Subject line
    html: selectTemplateFromPurpose({ username, purpose }), // html body
  });
};

export { sendEmail };
