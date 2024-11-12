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
    // const resetLink = `http://yourapp.com/reset-password?token=${token}`;
    const mailOptions = {
      from: 'Auth-backend service',
      to: to, // Adresse email de l'utilisateur
      subject: 'Password Reset Request',
      html: `
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <p>${otp}</p>
        <p>Ce lien expirera dans 1 heure.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
