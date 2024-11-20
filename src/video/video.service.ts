// import { Injectable } from '@nestjs/common';
// import { CreateVideoDto } from './dto/create-video.dto';
// import { UpdateVideoDto } from './dto/update-video.dto';
// import { InjectModel } from '@nestjs/mongoose';
// import { User } from '../auth/schemas/user.schema';
// import { Model } from 'mongoose';
// // import { constructor } from 'ts-loader';
// import { Video } from './entities/video.entity';
// import { UploadFileService } from '../services/uploadFile.service';
//
//
//
// @Injectable()
// export class VideoService {
//   constructor(
//     @InjectModel(Video.name) private readonly VideoModel: Model<Video>, // Injection du modèle Video
//     private readonly uploadFileService: UploadFileService, // Injection du service d'upload
//   ) {}
//
//   async create(file: Express.Multer.File, createVideoDto: CreateVideoDto) {
//     try {
//       // Upload de la vidéo sur Cloudinary
//       const url = await this.uploadFileService.uploadVideo(file);
//
//       // Création du document vidéo avec l'URL de la vidéo Cloudinary
//       const video = new this.VideoModel({
//         filename: url,
//         ...createVideoDto,
//       });
//       video.url = await this.uploadFileService.uploadVideo(file);
//
//       // Sauvegarde dans la base de données
//       return await video.save();
//     } catch (error) {
//       throw new Error(`Erreur lors de l'upload de la vidéo : ${error.message}`);
//     }
//   }
//
//
//   upload(url: string) {
//     const file = new File([url], "filename"); // Utilisez un tableau de données pour initialiser le fichier
//   }
//
//
//   findAll() {
//     return `This action returns all video`;
//   }
//
//   findOne(id: number) {
//     return `This action returns a #${id} video`;
//   }
//
//   update(id: number, updateVideoDto: UpdateVideoDto) {
//     return `This action updates a #${id} video`;
//   }
//
//   remove(id: number) {
//     return `This action removes a #${id} video`;
//   }
// }
import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video } from './entities/video.entity';
import { UploadFileService } from '../services/uploadFile.service';

@Injectable()
export class VideoService {
  constructor(
      @InjectModel(Video.name) private readonly VideoModel: Model<Video>, // Injection du modèle Video
      private readonly uploadFileService: UploadFileService, // Injection du service d'upload
  ) {}

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
}
