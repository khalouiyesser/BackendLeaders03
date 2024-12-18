// // mail.service.ts
// import * as nodemailer from 'nodemailer';
// import { Injectable } from '@nestjs/common';
//
// @Injectable()
// export class MailService {
//   private transporter: nodemailer.Transporter;
//
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,  // Mets "true" pour SSL/TLS sur le port 465
//       auth: {
//         user: 'yesser.khaloui@etudiant-fst.utm.tn',
//         pass: 'wgsynqjoiolzvwzt',
//       },
//     });
//   }
//
//   async sendPasswordResetEmail(to: string, otp: number) {
//
//
//
//
//
//     const mailOptions = {
//       from: 'Auth-backend service',
//       to: to,
//       subject: 'Password Reset Request',
//       html: `
//       <!DOCTYPE html>
//       <html lang="en">
//         <head>
//           <meta charset="UTF-8" />
//           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//           <meta http-equiv="X-UA-Compatible" content="ie=edge" />
//           <title>Static Template</title>
//           <link
//             href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
//             rel="stylesheet"
//           />
//         </head>
//         <body style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;">
//           <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner); background-repeat: no-repeat; background-size: 800px 452px; background-position: top center; font-size: 14px; color: #434343;">
//             <header>
//               <table style="width: 100%;">
//                 <tbody>
//                   <tr style="height: 0;">
//                     <td>
//                       <img alt="" src="https://res-console.cloudinary.com/dcjtuxprn/thumbnails/v1/image/upload/v1731662110/bG9nb191c2ZwNmQ=/drilldown" height="30px" />
//                     </td>
//                     <td style="text-align: right;">
//                       <span style="font-size: 16px; line-height: 30px; color: #ffffff;">${new Date().toLocaleDateString()}</span>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </header>
//             <main>
//               <div style="margin: 0; margin-top: 70px; padding: 92px 30px 115px; background: #ffffff; border-radius: 30px; text-align: center;">
//                 <div style="width: 100%; max-width: 489px; margin: 0 auto;">
//                   <h1 style="margin: 0; font-size: 24px; font-weight: 500; color: #1f1f1f;">Your OTP</h1>
//                   <p style="margin: 0; margin-top: 17px; font-size: 16px; font-weight: 500;">Hey there,</p>
//                   <p style="margin: 0; margin-top: 17px; font-weight: 500; letter-spacing: 0.56px;">
//                     Thank you for choosing our service. Use the following OTP to complete the password reset process. This OTP is valid for
//                     <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
//                     Do not share this code with others.
//                   </p>
//                   <p style="margin: 0; margin-top: 60px; font-size: 40px; font-weight: 600; letter-spacing: 25px; color: #ba3d4f;">
//                     ${otp}
//                   </p>
//                 </div>
//               </div>
//               <p style="max-width: 400px; margin: 0 auto; margin-top: 90px; text-align: center; font-weight: 500; color: #8c8c8c;">
//                 Need help? Contact us at <a href="mailto:support@example.com" style="color: #499fb6; text-decoration: none;">support@example.com</a>
//               </p>
//             </main>
//             <footer style="width: 100%; max-width: 490px; margin: 20px auto 0; text-align: center; border-top: 1px solid #e6ebf1;">
//               <p style="margin: 0; margin-top: 40px; font-size: 16px; font-weight: 600; color: #434343;">Our Company</p>
//               <p style="margin: 0; margin-top: 8px; color: #434343;">Address, City, State</p>
//               <div style="margin: 0; margin-top: 16px;">
//                 <!-- Social Media Icons Here -->
//               </div>
//               <p style="margin: 0; margin-top: 16px; color: #434343;">
//                 Copyright © 2024 Company. All rights reserved.
//               </p>
//             </footer>
//           </div>
//         </body>
//       </html>
//     `,
//     };
//
//     await this.transporter.sendMail(mailOptions);
//   }
//
//   // Méthode pour envoyer l'email de vérification
//   async sendEmailVerif(email: string, fullName: string) {
//
//
//     console.log(email + fullName)
//     const mailOptions = {
//       from: 'yesser.khaloui@etudiant-fst.utm.tn',
//       to: email,
//       subject: 'Bienvenue sur EchoTalent 🎉',
//       html: `
//         <!DOCTYPE html>
//         <html lang="fr">
//           <body>
//             <h1>Bienvenue, ${fullName} 👋</h1>
//             <p>
//               Merci d'avoir rejoint <strong>EchoTalent</strong>. Cliquez ci-dessous pour confirmer votre email.
//             </p>
//             <a href="https://echotalent.com/confirm?email=${encodeURIComponent(email)}"
//               style="background-color: #0066ff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">
//               Confirmer
//             </a>
//             <p style="margin-top: 20px; font-size: 12px; color: #888;">
//               Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.
//             </p>
//           </body>
//         </html>
//       `,
//     };
//
//     try {
//       await this.transporter.sendMail(mailOptions);
//       console.log('Verification Email sent successfully.');
//     } catch (error) {
//       console.error('Failed to send Verification Email:', error);
//       throw error;
//     }
//   }
//
//
// }
// mail.service.ts
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,  // Mets "true" pour SSL/TLS sur le port 465
      auth: {
        user: 'yesser.khaloui@etudiant-fst.utm.tn',
        pass: 'wgsynqjoiolzvwzt',
      },
    });
  }

  async sendPasswordResetEmail(to: string, otp: number) {
    const mailOptions = {
      from: 'Auth-backend service',
      to: to,
      subject: 'Password Reset Request',
      html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <title>Static Template</title>
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;">
          <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner); background-repeat: no-repeat; background-size: 800px 452px; background-position: top center; font-size: 14px; color: #434343;">
            <header>
              <table style="width: 100%;">
                <tbody>
                  <tr style="height: 0;">
                    <td>
                      <img alt="" src="https://res-console.cloudinary.com/dcjtuxprn/thumbnails/v1/image/upload/v1731662110/bG9nb191c2ZwNmQ=/drilldown" height="30px" />
                    </td>
                    <td style="text-align: right;">
                      <span style="font-size: 16px; line-height: 30px; color: #ffffff;">${new Date().toLocaleDateString()}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </header>
            <main>
              <div style="margin: 0; margin-top: 70px; padding: 92px 30px 115px; background: #ffffff; border-radius: 30px; text-align: center;">
                <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 500; color: #1f1f1f;">Your OTP</h1>
                  <p style="margin: 0; margin-top: 17px; font-size: 16px; font-weight: 500;">Hey there,</p>
                  <p style="margin: 0; margin-top: 17px; font-weight: 500; letter-spacing: 0.56px;">
                    Thank you for choosing our service. Use the following OTP to complete the password reset process. This OTP is valid for
                    <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
                    Do not share this code with others.
                  </p>
                  <p style="margin: 0; margin-top: 60px; font-size: 40px; font-weight: 600; letter-spacing: 25px; color: #ba3d4f;">
                    ${otp}
                  </p>
                </div>
              </div>
              <p style="max-width: 400px; margin: 0 auto; margin-top: 90px; text-align: center; font-weight: 500; color: #8c8c8c;">
                Need help? Contact us at <a href="mailto:support@example.com" style="color: #499fb6; text-decoration: none;">support@example.com</a>
              </p>
            </main>
            <footer style="width: 100%; max-width: 490px; margin: 20px auto 0; text-align: center; border-top: 1px solid #e6ebf1;">
              <p style="margin: 0; margin-top: 40px; font-size: 16px; font-weight: 600; color: #434343;">Our Company</p>
              <p style="margin: 0; margin-top: 8px; color: #434343;">Address, City, State</p>
              <div style="margin: 0; margin-top: 16px;">
                <!-- Social Media Icons Here -->
              </div>
              <p style="margin: 0; margin-top: 16px; color: #434343;">
                Copyright © 2024 Company. All rights reserved.
              </p>
            </footer>
          </div>
        </body>
      </html>
    `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Méthode pour envoyer l'email de vérification
  async sendEmailVerif(email: string, fullName: string) {


    console.log(email + fullName)
    const mailOptions = {
      from: 'yesser.khaloui@etudiant-fst.utm.tn',
      to: email,
      subject: 'Bienvenue sur EchoTalent 🎉',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
          <body>
            <h1>Bienvenue, ${fullName} 👋</h1>
            <p>
              Merci d'avoir rejoint <strong>EchoTalent</strong>. Cliquez ci-dessous pour confirmer votre email.
            </p>
            <a href="https://echotalent.com/confirm?email=${encodeURIComponent(email)}"
              style="background-color: #0066ff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">
              Confirmer
            </a>
            <p style="margin-top: 20px; font-size: 12px; color: #888;">
              Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.
            </p>
          </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Verification Email sent successfully.');
    } catch (error) {
      console.error('Failed to send Verification Email:', error);
      throw error;
    }
  }



}
