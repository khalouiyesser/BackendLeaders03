// // uploadFile.service.ts
// import { Injectable } from '@nestjs/common';
// import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
// import { ConfigService } from '@nestjs/config';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import * as multer from 'multer';
// import * as buffer from 'node:buffer';
//
// @Injectable()
// export class UploadFileService {
//   constructor(private readonly configService: ConfigService) {
//     cloudinary.config({
//       cloud_name: 'dcjtuxprn',
//       api_key: '895521131264718',
//       api_secret: 'KWOMg13-nRR5vh-ZcQQCQ7UZPdc',
//     });
//   }
//
//   private storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'UploadLeaders',
//       resource_type: 'video',
//       format: 'mp4',
//       public_id: (req, file) => file.originalname.split('.')[0],
//     } as unknown as Record<string, any>,
//   });
//   private storageImage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'UploadLeaders',
//       resource_type: 'video',
//       format: 'jpeg,png',
//       public_id: (req, file) => file.originalname.split('.')[0],
//     } as unknown as Record<string, any>,
//   });
//
//   public upload = multer({ storage: this.storage });
//   public uploadImage = multer({ storage: this.storageImage });
//
//   async uploadVideo(file: Express.Multer.File): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const buffer = file.buffer;
//       cloudinary.uploader.upload_stream(
//         { resource_type: 'image', folder: 'UploadLeaders', public_id: file.originalname.split('.')[0] },
//         (error, result: UploadApiResponse) => {
//           if (error) return reject(error);
//           resolve(result.secure_url);
//         },
//       ).end(buffer);
//     });
//   }
//
// }
// uploadFile.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';
import * as buffer from 'node:buffer';

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
    return new Promise((resolve, reject) => {
      const buffer = file.buffer;

      cloudinary.uploader.upload_stream(
          { resource_type: 'video', folder: 'UploadLeaders', public_id: file.originalname.split('.')[0] },
          (error, result: UploadApiResponse) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          },
      ).end(buffer);
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

}