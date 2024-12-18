import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreatePostulerDto } from './dto/create-postuler.dto';
import { UpdatePostulerDto } from './dto/update-postuler.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Postuler} from "./entities/postuler.entity";
import {User} from "../auth/schemas/user.schema";
import {Post} from "../post/entities/post.entity";
import {ClaudeApi} from "../services/Claude.service";
import {PostService} from "../post/post.service";
// import {PostService} from "../post/post.service";

@Injectable()
export class PostulerService {

  constructor( @InjectModel(Postuler.name) private readonly postulerModel: Model<Postuler>,
               @InjectModel(User.name) private readonly userModel: Model<User>,
               @InjectModel(Post.name) private readonly postModel: Model<Post>,
               private readonly claudeService: ClaudeApi,
               private readonly postService: PostService,
               ) {
  }


  async create(createPostulerDto: CreatePostulerDto) {
    try {
      // Recherche du post et de l'utilisateur
      const post = await this.postModel.findById(createPostulerDto.post);
      const user = await this.userModel.findById(createPostulerDto.user);

      console.log("11111111111111111111111111"+post.title + user.lastname)
      // Vérification de l'existence du post et de l'utilisateur
      if (!post || !user) {
        throw new NotFoundException('Post or User not found');
      }


      // Analyse du profil via le service Claude
      const score = await this.claudeService.analyseProfile(
          post.content,
          user.profileDescription
      );

      console.log("2222222222222222222222"+score)
      createPostulerDto.score = score


      return this.postulerModel.create(createPostulerDto)
    } catch (error) {
      throw new InternalServerErrorException('Impossible de traiter la postulation');
    }
  }

  findAll() {
    return `This action returns all postuler`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postuler`;
  }

  update(id: number, updatePostulerDto: UpdatePostulerDto) {
    return `This action updates a #${id} postuler`;
  }

  remove(id: number) {
    return `This action removes a #${id} postuler`;
  }

  async findCandidatByPost(postId: string) {
    // Trouver toutes les postulations liées à l'ID de la publication
    const postulations = await this.postulerModel.find({ post: postId });

    // Préparer une liste pour stocker les résultats
    const candidats = [];

    // Boucler sur chaque postulation
    for (const postulation of postulations) {
      // Trouver l'utilisateur lié à cette postulation
      const user = await this.userModel.findById(postulation.user);


      console.log(user.name + user.lastname)
      if (user) {
        // Ajouter les données utilisateur au tableau
        candidats.push({
          id: user.id,
          photoUrl: user.photoUrl,
          score: postulation.score,
          fullName: user.name + ' ' + user.lastname,
        });
      }
    }


    // Retourner la liste des candidats
    return candidats;
  }

  async stats(userId: string) {
    // Récupérer les posts de l'utilisateur
    const posts = await this.postService.findByUser(userId);

    const allScores = []; // Liste pour collecter tous les scores globalement
    // Préparer la réponse
    const response = [];

    // Boucle sur chaque post
    for (const post of posts) {
      const postId = post['id'];

      // Récupérer toutes les postulations pour ce post
      const postulers = await this.postulerModel.find({ post: postId }).exec();

      // Nombre de postulations pour ce post
      const count = postulers.length;

      // Extraire les scores de chaque postulation
      const scores = postulers.map((postulation) => postulation.score);

      allScores.push(...scores);
      // Ajouter le résultat à la réponse
      response.push({
        postName: post.title, // Assure-toi que "title" est le champ du titre du post
        postulations: count,
        scores, // Tableau des scores
      });
    }

    // Retourner la réponse
    return {response,
        allScores};
     // Liste de tous les scores pour tous les posts
  }

}
