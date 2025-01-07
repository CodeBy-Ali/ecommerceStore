import { MailOptions } from 'nodemailer/lib/sendmail-transport/index.js';
import logger from '../../config/logger.ts';
import createTransporter from '../../config/nodeMailer.ts';


// const createTransporter = () => {
//   const {email } = config.getOAuthConfig();
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     requireTLS: true,
//     auth: {
//         user: "baqar11121112@gmail.com",
//         pass: 'xbet tsss rhzl jbiv'
//     }
//   })
//   return transporter;
// }

const sendMail = async (options:MailOptions) => {
  const transporter = await createTransporter(); 
  try {
    logger.info(transporter);
    await transporter.sendMail(options);
  } catch (err) {
    logger.error("Failed to send email to user");
    logger.error(err);
  }
}

export default sendMail;