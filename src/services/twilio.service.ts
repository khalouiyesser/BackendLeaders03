import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
    private twilioClient: Twilio.Twilio;

    constructor(private configService: ConfigService) {
        this.twilioClient = Twilio(
            this.configService.get<string>('TWILIO_ACCOUNT_SID'),
            this.configService.get<string>('TWILIO_AUTH_TOKEN'),
        );
    }

    async sendSms(to: string, message: number): Promise<any> {
        return this.twilioClient.messages.create({
            body: String(message), // Convertir correctement le message en chaîne de caractères
            from: this.configService.get<string>('TWILIO_PHONE_NUMBER'), // Utiliser le numéro de téléphone Twilio
            to: to, // Numéro de destination
        });
    }

}
