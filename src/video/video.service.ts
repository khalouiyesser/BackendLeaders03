// import { Injectable } from '@nestjs/common';
// import { CreateVideoDto } from './dto/create-video.dto';
// import { UpdateVideoDto } from './dto/update-video.dto';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Video } from './entities/video.entity';
// import { UploadFileService } from '../services/uploadFile.service';
// import {SpeechClient} from "@google-cloud/speech";
// import {join} from "path";
// import * as fs from "node:fs";
// import * as ytdl from 'ytdl-core';
// import * as ffmpeg from 'fluent-ffmpeg';
// import {google} from "@google-cloud/speech/build/protos/protos";
// import AudioEncoding = google.cloud.speech.v1.RecognitionConfig.AudioEncoding;
// import * as https from "node:https";
//
// @Injectable()
// export class VideoService {
//   constructor(
//       @InjectModel(Video.name) private readonly VideoModel: Model<Video>, // Injection du modèle Video
//       private readonly uploadFileService: UploadFileService, // Injection du service d'upload
//   ) {}
//
//   private speechClient = new SpeechClient();
//
//   /**
//    * Extraire le texte d'une vidéo en téléchargeant depuis l'URL.
//    * @param videoUrl URL de la vidéo.
//    * @returns Transcription extraite de la vidéo.
//    */
//   async extractTextFromVideo(videoUrl: string): Promise<string> {
//     const videoPath = join(__dirname, 'video.mp4');
//     const audioPath = join(__dirname, 'audio.wav');
//
//
//     // Étape 1 : Télécharger la vidéo depuis l'URL
//     await this.downloadVideo(videoUrl, videoPath);
//
//     // Étape 2 : Extraire l'audio de la vidéo
//     await this.extractAudio(videoPath, audioPath);
//
//     // Étape 3 : Transcrire l'audio
//     const transcription = await this.transcribeAudio(audioPath);
//
//     // Supprimer les fichiers temporaires
//     fs.unlinkSync(videoPath);
//     fs.unlinkSync(audioPath);
//
//     return transcription;
//   }
//
//   /**
//    * Télécharger une vidéo depuis une URL.
//    * @param url URL de la vidéo.
//    * @param output Chemin de sortie pour le fichier vidéo.
//    */
//   private downloadVideo(url: string, output: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       const file = fs.createWriteStream(output);
//       https.get(url, (response) => {
//         response.pipe(file);
//         file.on('finish', () => resolve());
//       }).on('error', (err) => reject(err));
//     });
//   }
//
//   /**
//    * Extraire l'audio d'une vidéo.
//    * @param videoPath Chemin de la vidéo.
//    * @param audioPath Chemin de sortie pour l'audio extrait.
//    */
//   private extractAudio(videoPath: string, audioPath: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       ffmpeg(videoPath)
//           .output(audioPath)
//           .audioCodec('pcm_s16le')
//           .audioChannels(1)
//           .audioFrequency(16000)
//           .on('end', () => resolve())
//           .on('error', (err) => reject(err))
//           .run();
//     });
//   }
//
//   /**
//    * Transcrire un fichier audio.
//    * @param audioPath Chemin du fichier audio.
//    * @returns Texte transcrit.
//    */
//   private async transcribeAudio(audioPath: string): Promise<string> {
//     const audioBytes = fs.readFileSync(audioPath).toString('base64');
//
//     const request = {
//       audio: { content: audioBytes },
//       config: {
//         encoding: AudioEncoding.LINEAR16,
//         sampleRateHertz: 16000,
//         languageCode: 'fr-FR', // Changez la langue si nécessaire
//       },
//     };
//
//     const [response] = await this.speechClient.recognize(request);
//     return response.results?.map(result => result.alternatives[0].transcript).join(' ') || '';
//   }
//
//
//   // Créer une nouvelle vidéo en uploadant le fichier sur Cloudinary
//   async create(file: Express.Multer.File, createVideoDto: CreateVideoDto) {
//     try {
//       // Upload de la vidéo sur Cloudinary
//       const url = await this.uploadFileService.uploadVideo(file);
//
//       // Création du document vidéo avec l'URL de la vidéo Cloudinary
//       const video = new this.VideoModel({
//         filename: file.originalname, // Nom du fichier
//         url, // URL de la vidéo après upload sur Cloudinary
//         ...createVideoDto, // Autres données envoyées par le client
//       });
//
//       // Sauvegarde de la vidéo dans la base de données
//       return await video.save();
//     } catch (error) {
//       throw new Error(`Erreur lors de l'upload de la vidéo : ${error.message}`);
//     }
//   }
//
//   // Récupérer toutes les vidéos
//   async findAll() {
//     try {
//       return await this.VideoModel.find().exec(); // Retourne toutes les vidéos
//     } catch (error) {
//       throw new Error(`Erreur lors de la récupération des vidéos : ${error.message}`);
//     }
//   }
//
//   // Trouver une vidéo par ID
//   async findOne(id: string) {
//     try {
//       const video = await this.VideoModel.findById(id).exec(); // Recherche de la vidéo par ID
//       if (!video) {
//         throw new Error(`Vidéo avec ID ${id} non trouvée.`);
//       }
//       return video;
//     } catch (error) {
//       throw new Error(`Erreur lors de la récupération de la vidéo : ${error.message}`);
//     }
//   }
//
//   // Mettre à jour les informations d'une vidéo
//   async update(id: string, updateVideoDto: UpdateVideoDto) {
//     try {
//       const updatedVideo = await this.VideoModel.findByIdAndUpdate(id, updateVideoDto, { new: true }).exec();
//       if (!updatedVideo) {
//         throw new Error(`Vidéo avec ID ${id} non trouvée.`);
//       }
//       return updatedVideo;
//     } catch (error) {
//       throw new Error(`Erreur lors de la mise à jour de la vidéo : ${error.message}`);
//     }
//   }
//
//   // Supprimer une vidéo
//   async remove(id: string) {
//     try {
//       const deletedVideo = await this.VideoModel.findByIdAndDelete(id).exec();
//       if (!deletedVideo) {
//         throw new Error(`Vidéo avec ID ${id} non trouvée.`);
//       }
//       return { message: `Vidéo avec ID ${id} supprimée avec succès.` };
//     } catch (error) {
//       throw new Error(`Erreur lors de la suppression de la vidéo : ${error.message}`);
//     }
//   }
// }
import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video } from './entities/video.entity';
import { UploadFileService } from '../services/uploadFile.service';
import { SpeechClient } from '@google-cloud/speech';
import { join } from 'path';
import * as fs from 'node:fs';
import * as ytdl from 'ytdl-core';
import * as ffmpeg from 'fluent-ffmpeg';
import { google } from '@google-cloud/speech/build/protos/protos';
import AudioEncoding = google.cloud.speech.v1.RecognitionConfig.AudioEncoding;
import * as https from 'node:https';

@Injectable()
export class VideoService {
  constructor(
      @InjectModel(Video.name) private readonly VideoModel: Model<Video>, // Injection du modèle Video
      private readonly uploadFileService: UploadFileService, // Injection du service d'upload
  ) {}

  private speechClient = new SpeechClient();

  // Configurer le chemin de FFmpeg

  private static ffmpegPath = 'C:/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe'; // Spécifier explicitement le chemin

  /**
   * Extraire le texte d'une vidéo en téléchargeant depuis l'URL.
   * @param videoUrl URL de la vidéo.
   * @returns Transcription extraite de la vidéo.
   */
  async extractTextFromVideo(videoUrl: string): Promise<string> {
    const videoPath = join(__dirname, 'video.mp4');
    const audioPath = join(__dirname, 'audio.wav');

    // Étape 1 : Télécharger la vidéo depuis l'URL
    await this.downloadVideo(videoUrl, videoPath);

    // Étape 2 : Extraire l'audio de la vidéo
    await this.extractAudio(videoPath, audioPath);

    // Étape 3 : Transcrire l'audio
    const transcription = await this.transcribeAudio(audioPath);

    // Supprimer les fichiers temporaires
    fs.unlinkSync(videoPath);
    fs.unlinkSync(audioPath);

    return transcription;
  }

  /**
   * Télécharger une vidéo depuis une URL.
   * @param url URL de la vidéo.
   * @param output Chemin de sortie pour le fichier vidéo.
   */
  private downloadVideo(url: string, output: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(output);
      https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => resolve());
      }).on('error', (err) => reject(err));
    });
  }

  /**
   * Extraire l'audio d'une vidéo.
   * @param videoPath Chemin de la vidéo.
   * @param audioPath Chemin de sortie pour l'audio extrait.
   */
  private extractAudio(videoPath: string, audioPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
          .setFfmpegPath(VideoService.ffmpegPath) // Spécifier le chemin de FFmpeg
          .output(audioPath)
          .audioCodec('pcm_s16le')
          .audioChannels(1)
          .audioFrequency(16000)
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .run();
    });
  }

  /**
   * Transcrire un fichier audio.
   * @param audioPath Chemin du fichier audio.
   * @returns Texte transcrit.
   */
  private async transcribeAudio(audioPath: string): Promise<string> {
    const audioBytes = fs.readFileSync(audioPath).toString('base64');

    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: AudioEncoding.LINEAR16,
        sampleRateHertz: 16000,
        languageCode: 'fr-FR', // Changez la langue si nécessaire
      },
    };

    const [response] = await this.speechClient.recognize(request);
    return response.results?.map(result => result.alternatives[0].transcript).join(' ') || '';
  }

  // Créer une nouvelle vidéo en uploadant le fichier sur Cloudinary
  async create(file: Express.Multer.File, createVideoDto: CreateVideoDto) {
    try {
      // Upload de la vidéo sur Cloudinary
      const url = await this.uploadFileService.uploadVideo(file);

      // Création du document vidéo avec l'URL de la vidéo Cloudinary
      const video = new this.VideoModel({
        filename: file.originalname, // Nom du fichier
        url, // URL de la vidéo après upload sur Cloudinary
        ...createVideoDto, // Autres données envoyées par le client
      });

      // Sauvegarde de la vidéo dans la base de données
      return await video.save();
    } catch (error) {
      throw new Error(`Erreur lors de l'upload de la vidéo : ${error.message}`);
    }
  }

  // Récupérer toutes les vidéos
  async findAll() {
    try {
      return await this.VideoModel.find().exec(); // Retourne toutes les vidéos
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des vidéos : ${error.message}`);
    }
  }

  // Trouver une vidéo par ID
  async findOne(id: string) {
    try {
      const video = await this.VideoModel.findById(id).exec(); // Recherche de la vidéo par ID
      if (!video) {
        throw new Error(`Vidéo avec ID ${id} non trouvée.`);
      }
      return video;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la vidéo : ${error.message}`);
    }
  }

  // Mettre à jour les informations d'une vidéo
  async update(id: string, updateVideoDto: UpdateVideoDto) {
    try {
      const updatedVideo = await this.VideoModel.findByIdAndUpdate(id, updateVideoDto, { new: true }).exec();
      if (!updatedVideo) {
        throw new Error(`Vidéo avec ID ${id} non trouvée.`);
      }
      return updatedVideo;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la vidéo : ${error.message}`);
    }
  }

  // Supprimer une vidéo
  async remove(id: string) {
    try {
      const deletedVideo = await this.VideoModel.findByIdAndDelete(id).exec();
      if (!deletedVideo) {
        throw new Error(`Vidéo avec ID ${id} non trouvée.`);
      }
      return { message: `Vidéo avec ID ${id} supprimée avec succès.` };
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la vidéo : ${error.message}`);
    }
  }


  async findByUrl(url: string): Promise<Video | null> {
    console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvv",url)
    return this.VideoModel.findOne({ url }).exec();
  }

}
