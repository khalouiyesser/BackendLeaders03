import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

import {Commentaire} from "./entities/commentaire.entity";
import {Post} from "../post/entities/post.entity";
import {User} from "../auth/schemas/user.schema";

@Injectable()
export class CommentaireService {

  constructor(
      // @InjectModel(Post.name) private readonly postModel: Model<Post>,
      @InjectModel(User.name) private readonly userModel: Model<User>,
      @InjectModel(Commentaire.name) private readonly commentaireModel: Model<Commentaire>,
      @InjectModel(Post.name) private readonly postModel: Model<Post>,
      // private commentaireService: CommentaireService,
  ) {}

  // async create(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
  //   const { user, Contenu, post } = createCommentaireDto;
  //
  //   // Rechercher le Post correspondant
  //   const fullPost = await this.postModel.findById(post).exec();
  //   if (!fullPost) {
  //     throw new NotFoundException('Post not found');
  //   }
  //
  //   const fullUser = await this.userModel.findById(user)
  //
  //   if (!fullUser) {
  //     throw new NotFoundException('Post not found');
  //   }
  //   // Construire le commentaire
  //   const newCommentaire = new this.commentaireModel({
  //     user,
  //     Contenu,
  //     post, // On associe simplement l'ID du Post pour éviter les références circulaires
  //   });
  //
  //   // Sauvegarder le commentaire dans la base de données
  //   const savedCommentaire = await newCommentaire.save();
  //
  //
  //   // Ajouter le commentaire dans la liste des commentaires du Post
  //   await this.postModel.findByIdAndUpdate(
  //       post, // Identifiant du Post à mettre à jour
  //       { $push: { commentaires: savedCommentaire } }, // Ajouter le commentaire au tableau
  //       { new: true } // Retourner la version mise à jour du document (optionnel si nécessaire)
  //   );
  //
  //   // Retourner le commentaire enregistré
  //   return savedCommentaire;
  // }


  async create(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
    const { user, Contenu, post } = createCommentaireDto;

    // Rechercher le Post correspondant
    const fullPost = await this.postModel.findById(post).exec();
    if (!fullPost) {
      throw new NotFoundException('Post not found');
    }

    // Rechercher l'utilisateur correspondant
    const fullUser = await this.userModel.findById(user).exec();
    if (!fullUser) {
      throw new NotFoundException('User not found');
    }

    // Construire le commentaire avec les objets complets user et post
    const newCommentaire = new this.commentaireModel({
      user: fullUser,  // Utiliser l'objet complet user
      Contenu,
      post: fullPost,  // Utiliser l'objet complet post
    });

    // Sauvegarder le commentaire dans la base de données
    const savedCommentaire = await newCommentaire.save();

    // Ajouter le commentaire dans la liste des commentaires du Post
    await this.postModel.findByIdAndUpdate(
        post, // Identifiant du Post à mettre à jour
        { $push: { commentaires: savedCommentaire } }, // Ajouter le commentaire au tableau
        { new: true } // Retourner la version mise à jour du document (optionnel si nécessaire)
    );

    // Retourner le commentaire enregistré
    return savedCommentaire;
  }









  // async create(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
  //   // Récupérer l'objet complet du Post
  //   const post = await this.postModel.findById(createCommentaireDto.post).exec();
  //   if (!post) {
  //     throw new NotFoundException('Post not found');
  //   }
  //
  //   // Créer un nouveau commentaire
  //   const commentaire = new this.commentaireModel({
  //     user: createCommentaireDto.user,
  //     Contenu: createCommentaireDto.Contenu,
  //     // post: post, // Ajouter l'objet complet du Post
  //   });
  //
  //   const savedCommentaire = await commentaire.save();
  //
  //   // Ajouter l'objet complet du commentaire au tableau `commentaires` du Post
  //   post.commentaires.push(savedCommentaire);
  //
  //   // Sauvegarder le Post
  //
  //   await post.save();
  //
  //   return this.commentaireModel.create(savedCommentaire);
  // }



  async findAll(): Promise<Commentaire[]> {
    return this.commentaireModel.find().exec(); // Récupérer tous les commentaires
  }

  findOne(id: string) {
    return `This action returns a #${id} commentaire`;
  }

  update(id: string, updateCommentaireDto: UpdateCommentaireDto) {
    return `This action updates a #${id} commentaire`;
  }

  remove(id: string) {
    return `This action removes a #${id} commentaire`;
  }
}
