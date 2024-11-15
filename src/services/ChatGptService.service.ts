// // chatgpt.service.ts
// import { Injectable } from '@nestjs/common';
// import * as https from 'https';
//
// @Injectable()
// export class ChatGptService {
//   async sendMessageToApi(content: string): Promise<any> {
//     const options = {
//       method: 'POST',
//       hostname: 'chatgpt-42.p.rapidapi.com',
//       port: null,
//       path: '/conversationllama3',
//       headers: {
//         'x-rapidapi-key': '1222d1ee5emsh4b0ce1a8d73903ep1ade42jsn7111d7b67e4a',
//         'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
//         'Content-Type': 'application/json',
//       },
//     };
//
//     return new Promise((resolve, reject) => {
//       const req = https.request(options, (res) => {
//         const chunks = [];
//
//         res.on('data', (chunk) => {
//           chunks.push(chunk);
//         });
//
//         res.on('end', () => {
//           const body = Buffer.concat(chunks).toString();
//           resolve(JSON.parse(body));
//         });
//       });
//
//       req.on('error', (e) => reject(e));
//
//       req.write(
//         JSON.stringify({
//           messages: [
//             {
//               role: 'user',
//               content: content,
//             },
//           ],
//           web_access: false,
//         }),
//       );
//
//       req.end();
//     });
//   }
// }
import { Injectable } from '@nestjs/common';
import * as https from 'https';

@Injectable()
export class ChatGptService {
  async generateQuestionsForOffer(offerDescription: string): Promise<any> {
    const prompt = `
      Voici une description d'une offre de stage : 
      "${offerDescription}" 

      Génère 10 questions techniques pertinentes sur cette offre et retourne-les au format JSON, 
      avec la structure suivante :
      {
        "question1": "Le contenu de la question 1",
        "question2": "Le contenu de la question 2",
        ...
        "question10": "Le contenu de la question 10"
      }
    `;

    const options = {
      method: 'POST',
      hostname: 'chatgpt-42.p.rapidapi.com',
      port: null,
      path: '/conversationllama3',
      headers: {
        'x-rapidapi-key': '1222d1ee5emsh4b0ce1a8d73903ep1ade42jsn7111d7b67e4a',
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks).toString();
          resolve(JSON.parse(body));
        });
      });

      req.on('error', (e) => reject(e));

      req.write(
        JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          web_access: false,
        }),
      );

      req.end();
    });
  }
}
