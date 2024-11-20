import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import {Model, Types} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import {JwtService} from "@nestjs/jwt";
import {VideoService} from "../video/video.service";
// import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private videoService: VideoService,
  ) {}
  async create(createPostDto: CreatePostDto): Promise<Post> {

    // const {title, user,videos,content} =CreatePostDto
    const {title, content,user,videos} = createPostDto;
    // Créer une nouvelle instance de Post avec les données du DTO
    const newPost = new this.postModel(createPostDto);

    // Ajouter l'ID de l'utilisateur à la propriété 'userId' du post
    // newPost.user = userId;  // Utilise l'ID de l'utilisateur passé par le guard

    // Sauvegarder le post dans la base de données
    const createdPost = await newPost.save();

    // Optionnel : Ajouter le post à l'utilisateur (si tu veux garder cette relation)
    // Si tu ne veux pas lier le post à un utilisateur, tu peux ignorer cette ligne
    await this.userModel.findByIdAndUpdate(user, { $push: { posts: createdPost} });

    return createdPost;
  }


  async createWithVideo(file: Express.Multer.File, createPostDto: CreatePostDto): Promise<Post> {
    try {
      // Étape 1 : Créer une vidéo si un fichier est fourni
      let videoId: Types.ObjectId | null = null;

      if (file) {
        // Appeler le service vidéo pour créer la vidéo
        const video = await this.videoService.create(file, {
          title: createPostDto.title, // Par exemple, le titre du post comme titre de la vidéo
          description: `Vidéo associée au post : ${createPostDto.title}`,
        });

        // Récupérer l'ID de la vidéo créée
        videoId = video._id;
      }

      // Étape 2 : Ajouter l'ID de la vidéo au DTO du post
      const { title, content, user } = createPostDto;
      const newPost = new this.postModel({
        title,
        content,
        user,
        videos: videoId ? [videoId] : [], // Inclure l'ID de la vidéo si elle existe
      });

      // Sauvegarder le post dans la base de données
      const createdPost = await newPost.save();

      // Étape 3 : Mettre à jour l'utilisateur pour inclure ce post
      await this.userModel.findByIdAndUpdate(user, { $push: { posts: createdPost } });

      return createdPost;
    } catch (error) {
      throw new Error(`Erreur lors de la création du post avec vidéo : ${error.message}`);
    }
  }


  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
