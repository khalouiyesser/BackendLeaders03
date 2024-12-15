
// uploadFile.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';
import * as path from "node:path";
import * as fs from "node:fs";
import * as ffmpeg from 'fluent-ffmpeg';


@Injectable()
export class UploadFileService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: 'dcjtuxprn',
      api_key: '895521131264718',
      api_secret: 'KWOMg13-nRR5vh-ZcQQCQ7UZPdc',
    });
  }

  private storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'UploadLeaders',
      resource_type: 'video',
      format: 'mp4',
      public_id: (req, file) => file.originalname.split('.')[0],
    } as unknown as Record<string, any>,
  });
  private storageImage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'UploadLeaders',
      resource_type: 'video',
      format: 'jpeg,png',
      public_id: (req, file) => file.originalname.split('.')[0],
    } as unknown as Record<string, any>,
  });

  public upload = multer({ storage: this.storage });
  public uploadImage = multer({ storage: this.storageImage });

  async uploadVideo(file: Express.Multer.File): Promise<string> {

    const compressedBuffer = await this.compressVideo(file.buffer);

    console.log("111111111111111111111",compressedBuffer)
    return new Promise((resolve, reject) => {
      // const buffer = file.buffer;

      cloudinary.uploader.upload_stream(
          { resource_type: 'video', folder: 'UploadLeaders', public_id: file.originalname.split('.')[0] },
          (error, result: UploadApiResponse) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          },
      ).end(compressedBuffer);
    });
  }
  async uploadImageA(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const buffer = file.buffer;

      cloudinary.uploader.upload_stream(
          { resource_type: 'image',
            folder: 'UploadLeaders',
            public_id: file.originalname.split('.')[0] },
          (error, result: UploadApiResponse) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          },
      ).end(buffer);
    });
  }

  async uploadLocal(file: Express.Multer.File) {
    const storage = multer.diskStorage({
      destination: './uploads',  // Dossier où les fichiers seront enregistrés
      filename: (req, file, callback) => {
        // Personnalisation du nom du fichier pour éviter les doublons
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
      }
    });

    // Return or use the storage configuration as needed
    return storage;
  }
  // public upload = multer({ storage: this.storage });
  // public uploadImage = multer({ storage: this.storageImage });

  async compressVideo(inputBuffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {

      const tempDir = './temp';
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const tempInputPath = `./temp/${Date.now()}-input.mp4`;
      const tempOutputPath = `./temp/${Date.now()}-output.mp4`;

      // Write input buffer to temporary file
      fs.writeFileSync(tempInputPath, inputBuffer);

      // Use ffmpeg to compress the video
      ffmpeg(tempInputPath)
          .output(tempOutputPath)
          .videoCodec('libx264')
          .size('360x?') // Resize to 640px width, keeping aspect ratio
          .outputOptions('-crf 28') // Adjust compression level
          .on('end', () => {
            const compressedBuffer = fs.readFileSync(tempOutputPath);
            fs.unlinkSync(tempInputPath); // Cleanup temp input file
            fs.unlinkSync(tempOutputPath); // Cleanup temp output file
            resolve(compressedBuffer);
          })
          .on('error', (error) => {
            fs.unlinkSync(tempInputPath); // Cleanup temp input file
            reject(error);
          })
          .run();
    });
  }




}
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from 'cloudinary';
// import multer from 'multer';
// import ffmpeg from 'fluent-ffmpeg';
// import path from 'path';
// import fs from 'fs';
// import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
// import { ConfigService } from '@nestjs/config';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
//
// cloudinary.config({
//   cloud_name: 'dcjtuxprn',
//   api_key: '895521131264718',
//   api_secret: 'KWOMg13-nRR5vh-ZcQQCQ7UZPdc',
// });
//
// class UploadFileService {
//   private storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'UploadLeaders',
//       resource_type: 'video',
//       format: 'mp4',
//       public_id: (req, file) => file.originalname.split('.')[0],
//     } as unknown as Record<string, any>,
//   });
//
//   private storageImage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'UploadLeaders',
//       resource_type: 'image',
//       format: 'jpeg',
//       public_id: (req, file) => file.originalname.split('.')[0],
//     } as unknown as Record<string, any>,
//   });
//
//   public upload = multer({ storage: this.storage });
//   public uploadImage = multer({ storage: this.storageImage });
//
//   async compressVideo(inputBuffer: Buffer): Promise<Buffer> {
//     return new Promise((resolve, reject) => {
//       const tempInputPath = `./temp/${Date.now()}-input.mp4`;
//       const tempOutputPath = `./temp/${Date.now()}-output.mp4`;
//
//       // Write input buffer to temporary file
//       fs.writeFileSync(tempInputPath, inputBuffer);
//
//       // Use ffmpeg to compress the video
//       ffmpeg(tempInputPath)
//           .output(tempOutputPath)
//           .videoCodec('libx264')
//           .size('640x?') // Resize to 640px width, keeping aspect ratio
//           .outputOptions('-crf 28') // Adjust compression level
//           .on('end', () => {
//             const compressedBuffer = fs.readFileSync(tempOutputPath);
//             fs.unlinkSync(tempInputPath); // Cleanup temp input file
//             fs.unlinkSync(tempOutputPath); // Cleanup temp output file
//             resolve(compressedBuffer);
//           })
//           .on('error', (error) => {
//             fs.unlinkSync(tempInputPath); // Cleanup temp input file
//             reject(error);
//           })
//           .run();
//     });
//   }
//
//   async uploadVideo(file: Express.Multer.File): Promise<string> {
//     try {
//       // Compress the video before upload
//       const compressedBuffer = await this.compressVideo(file.buffer);
//
//       return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//             { resource_type: 'video', folder: 'UploadLeaders', public_id: file.originalname.split('.')[0] },
//             (error, result) => {
//               if (error) return reject(error);
//               resolve(result.secure_url);
//             }
//         ).end(compressedBuffer);
//       });
//     } catch (error) {
//       throw new Error(`Video upload failed: ${error.message}`);
//     }
//   }
//
//   async uploadImage(file: Express.Multer.File): Promise<string> {
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//           { resource_type: 'image', folder: 'UploadLeaders', public_id: file.originalname.split('.')[0] },
//           (error, result) => {
//             if (error) return reject(error);
//             resolve(result.secure_url);
//           }
//       ).end(file.buffer);
//     });
//   }
//
//   uploadLocal() {
//     return multer.diskStorage({
//       destination: './uploads',
//       filename: (req, file, callback) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         const extension = path.extname(file.originalname);
//         callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
//       },
//     });
//   }
// }
//
// export default new UploadService();
