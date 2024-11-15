import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { Model } from 'mongoose';
// import { constructor } from 'ts-loader';
import { Video } from './entities/video.entity';
import { UploadFileService } from '../services/uploadFile.service';



@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private readonly VideoModel: Model<Video>, // Injection du modèle Video
    private readonly uploadFileService: UploadFileService, // Injection du service d'upload
  ) {}

  async create(file: Express.Multer.File, createVideoDto: CreateVideoDto) {
    try {
      // Upload de la vidéo sur Cloudinary
      const url = await this.uploadFileService.uploadVideo(file);

      // Création du document vidéo avec l'URL de la vidéo Cloudinary
      const video = new this.VideoModel({
        filename: url,
        ...createVideoDto,
      });
      video.url = await this.uploadFileService.uploadVideo(file);

      // Sauvegarde dans la base de données
      return await video.save();
    } catch (error) {
      throw new Error(`Erreur lors de l'upload de la vidéo : ${error.message}`);
    }
  }


  upload(url: string) {
    const file = new File([url], "filename"); // Utilisez un tableau de données pour initialiser le fichier
  }


  findAll() {
    return `This action returns all video`;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
