import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

import {Commentaire} from "./entities/commentaire.entity";
import {Post} from "../post/entities/post.entity";
import {User} from "../auth/schemas/user.schema";

import {PostService} from "../post/post.service";

@Injectable()
export class CommentaireService {

  constructor(
      // @InjectModel(Post.name) private readonly postModel: Model<Post>,
      @InjectModel(User.name) private readonly userModel: Model<User>,
      @InjectModel(Commentaire.name) private readonly commentaireModel: Model<Commentaire>,
      @InjectModel(Post.name) private readonly postModel: Model<Post>,
       private postService: PostService,
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


  async create(createCommentaireDto: CreateCommentaireDto): Promise<any> {
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
      user: user, // ID de l'utilisateur
      Contenu,
      post: post, // ID du post
    });

    // Sauvegarder le commentaire dans la base de données
    const savedCommentaire = await newCommentaire.save();

    // Ajouter le commentaire dans la liste des commentaires du Post
    await this.postModel.findByIdAndUpdate(
        post,
        { $push: { commentaires: savedCommentaire._id } },
        { new: true }
    );

    // Construire un objet enrichi avec les informations utilisateur
    const enrichedComment = {
      ...savedCommentaire.toObject(), // Convertir le commentaire en objet JavaScript
      imageUrl: fullUser.photoUrl, // Ajouter l'URL de la photo de l'utilisateur
      fullName: `${fullUser.name} ${fullUser.lastname}`, // Ajouter le nom complet de l'utilisateur
    };

    // Retourner le commentaire enrichi
    return enrichedComment;
  }



  async createIos(videoUrl: string, user: string, contenu: string): Promise<Commentaire> {
    console.log("Video URL:", videoUrl);

    // Rechercher tous les posts
    const posts = await this.postService.findAll();
    console.log("Posts video URLs:", posts.map(post => post.videoUrl));

    // Trouver le post correspondant
    const toUpdate = posts.find((post) => post.videoUrl === videoUrl);
    if (!toUpdate) {
      throw new NotFoundException(`Post not found for the given videoUrl: ${videoUrl}`);
    }

    console.log("Post to update:", toUpdate);

    // Rechercher le Post complet
    const fullPost = await this.postModel.findById(toUpdate._id).exec();
    if (!fullPost) {
      throw new NotFoundException('Post not found in the database');
    }

    // Rechercher l'utilisateur complet
    const fullUser = await this.userModel.findById(user).exec();
    if (!fullUser) {
      throw new NotFoundException('User not found');
    }

    // Construire le commentaire avec les objets complets user et post
    const newCommentaire = new this.commentaireModel({
      user: fullUser._id, // Sauvegarder uniquement l'ID de l'utilisateur
      Contenu : contenu,            // Le contenu du commentaire
      post: fullPost._id, // Sauvegarder uniquement l'ID du post
    });

    // Sauvegarder le commentaire dans la base de données
    const savedCommentaire = await newCommentaire.save();
    console.log("Commentaire saved:", savedCommentaire);

    // Ajouter le commentaire dans la liste des commentaires du Post
    const updatedPost = await this.postModel.findByIdAndUpdate(
        fullPost._id, // Identifiant du Post à mettre à jour
        { $push: { commentaires: savedCommentaire._id } }, // Ajouter le commentaire à la liste des commentaires
        { new: true } // Retourner la version mise à jour du document
    );

    if (!updatedPost) {
      throw new Error('Failed to update post with the new comment');
    }

    console.log("Updated Post with Comment:", updatedPost);

    // Retourner le commentaire enregistré
    return savedCommentaire;
  }



  async findCommentParVideo(idPost: string): Promise<Commentaire[]> {
    // Récupérer tous les posts
    const posts = await this.postService.findAll();

    // Trouver le post correspondant à l'URL de la vidéo
    const post = posts.find((post) => post.id === idPost);

    // Vérifier si le post a été trouvé
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Récupérer les commentaires associés au post
    const comments = await this.commentaireModel.find({ post: post._id }).exec();

    // Ajouter les champs imageUrl et fullName dans le retour des commentaires
    const enrichedComments = [];

    for (const comment of comments) {
      // Trouver l'utilisateur associé au commentaire
      const user = await this.userModel.findById(comment.user).exec();

      // Vérifier si l'utilisateur existe
      if (user) {
        // Ajouter imageUrl et fullName au commentaire
        const enrichedComment = {
          ...comment.toObject(),  // Convertir le commentaire en un objet pour ajouter des champs
          imageUrl: user.photoUrl, // Ajouter l'URL de la photo de l'utilisateur
          fullName: `${user.name} ${user.lastname}`, // Ajouter le nom complet de l'utilisateur
        };
        enrichedComments.push(enrichedComment);  // Ajouter le commentaire enrichi à la liste
      }
    }

    // Retourner les commentaires enrichis
    return enrichedComments;
  }



  async findCOmmentParPosts(idPost: string): Promise<Commentaire[]> {
    const comments = this.commentaireModel.find({post : idPost})
    const enrichedComments = []
    for (const comment of await comments) {
      // Trouver l'utilisateur associé au commentaire
      const user = await this.userModel.findById(comment.user).exec();

      // Vérifier si l'utilisateur existe
      if (user) {
        // Ajouter imageUrl et fullName au commentaire
        const enrichedComment = {
          ...comment.toObject(),  // Convertir le commentaire en un objet pour ajouter des champs
          imageUrl: user.photoUrl, // Ajouter l'URL de la photo de l'utilisateur
          fullName: `${user.name} ${user.lastname}`, // Ajouter le nom complet de l'utilisateur
        };
        enrichedComments.push(enrichedComment);  // Ajouter le commentaire enrichi à la liste
      }
    }


    return enrichedComments
  }


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
