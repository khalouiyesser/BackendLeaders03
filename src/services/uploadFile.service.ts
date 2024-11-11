import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import * as multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Étendre le type Express pour inclure Multer.File
declare global {
  namespace Express {
    export interface MulterFile {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }
}

@Injectable()
export class UploadFileService {
  constructor(private readonly configService: ConfigService) {
    // Configurer Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('dcjtuxprn'),
      api_key: this.configService.get<string>('895521131264718'),
      api_secret: this.configService.get<string>('KWOMg13-nRR5vh-ZcQQCQ7UZPdc'),
    });
  }

  // Configurer multer avec le stockage Cloudinary
  private storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'videos', // Spécifie le dossier où stocker les vidéos
      resource_type: 'video', // Définit le type de ressource comme "video"
      format: async () => 'mp4', // Optionnel, spécifie le format vidéo de sortie
      public_id: (req, file) => file.originalname.split('.')[0], // Utilise le nom de fichier sans extension comme ID
    } as unknown as Record<string, any>, // Utiliser un cast pour forcer l'acceptation,
  });

  public upload = multer({ storage: this.storage });

  // Fonction pour uploader une vidéo et obtenir l'URL publique
  async uploadVideo(file: Express.MulterFile): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        { resource_type: 'video' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url); // Retourne l'URL publique de la vidéo
        },
      );
    });
  }
}
