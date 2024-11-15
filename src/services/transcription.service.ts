import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as https from 'https';
import * as FormData from 'form-data';

@Injectable()
export class TranscriptionService {
  private readonly rapidApiKey = '1222d1ee5emsh4b0ce1a8d73903ep1ade42jsn7111d7b67e4a';
  private readonly rapidApiHost = 'openai-whisper-speech-to-text-api.p.rapidapi.com';

  async transcribeVideo(filePath: string): Promise<string> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at path: ${filePath}`);
      }

      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      console.log('Sending file:', filePath);
      console.log('Form data headers:', form.getHeaders());

      const options = {
        method: 'POST',
        hostname: this.rapidApiHost,
        path: '/transcribe',
        headers: {
          ...form.getHeaders(),
          'x-rapidapi-key': this.rapidApiKey,
          'x-rapidapi-host': this.rapidApiHost,
        },
      };

      return new Promise<string>((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            try {
              console.log('Raw response:', data);
              const parsedData = JSON.parse(data);
              console.log('Parsed API Response:', parsedData);

              if (parsedData.transcription) {
                fs.unlink(filePath, (err) => {
                  if (err) console.error('Error deleting file:', err);
                });

                resolve(parsedData.transcription);
              } else {
                reject(new Error(parsedData.error || 'No transcription found in response'));
              }
            } catch (error) {
              reject(new Error(`Failed to parse API response: ${error.message}`));
            }
          });
        });

        req.on('error', (error) => {
          console.error('Request error:', error);
          reject(new Error(`Request failed: ${error.message}`));
        });

        // Pipe le form data dans la requête sans req.end();
        form.pipe(req);
      });

    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }
}
