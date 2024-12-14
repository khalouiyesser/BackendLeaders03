
import {Injectable, NotFoundException} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { VideoService } from '../video/video.service';
// import { Video } from '../video/entities/video.entity';

@Injectable()
export class PostService {
  constructor(
      @InjectModel(Post.name) private readonly postModel: Model<Post>, // Modèle pour les posts
      @InjectModel(User.name) private readonly userModel: Model<User>, // Modèle pour les utilisateurs
      private videoService: VideoService, // Service vidéo
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { title, content, user, videos } = createPostDto;

    // Créer une nouvelle instance de Post avec les données du DTO
    const newPost = new this.postModel({
      title,
      content,
      user,
      videos,
    });

    // Sauvegarder le post dans la base de données
    const createdPost = await newPost.save();

    // Optionnel : Ajouter le post à l'utilisateur
    await this.userModel.findByIdAndUpdate(
        user,
        { $push: { posts: createdPost } },
        { new: true }, // Retourner l'utilisateur mis à jour
    );

    return createdPost;
  }

  async createWithVideo(file: Express.Multer.File, createPostDto: CreatePostDto): Promise<Post> {

    console.log('File received:', file);
    console.log('File size:', file.size);
    console.log('File mimetype:', file.mimetype);
    console.log('Post DTO:', createPostDto);

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

     // const fullUser = await this.userModel.findById(user).exec()

      // if (!fullUser){
      //   throw new NotFoundException('Post not found');
      // }

      const newPost = new this.postModel({
        title,
        content,
        user,
        videos: videoId ? [videoId] : [], // Inclure l'ID de la vidéo si elle existe
      });

      // Sauvegarder le post dans la base de données
      const createdPost = await newPost.save();

      // Étape 3 : Mettre à jour l'utilisateur pour inclure ce post
      await this.userModel.findByIdAndUpdate(
          user,
          { $push: { posts: createdPost } },
          { new: true }, // Retourner l'utilisateur mis à jour
      );


      return createdPost;
    } catch (error) {
      throw new Error(`Erreur lors de la création du post avec vidéo : ${error.message}`);
    }
  }


  async updatePost(id: string, survey: any): Promise<Post> {
    // Recherche du post par ID
    const existingPost = await this.postModel.findById(id);
    if (!existingPost) {
      throw new NotFoundException(`Post avec l'id ${id} introuvable`);
    }

    // Ajout ou mise à jour de la variable survey
    existingPost.survey = survey;

    // Sauvegarde des modifications
    return existingPost.save();
  }

  async findByUser(id: string): Promise<Post[]> {
    // Trouver tous les posts associés à l'utilisateur
    const posts = await this.postModel.find({ user: id }).exec();

    // Parcourir chaque post pour ajouter le champ `videoUrl`
    for (const post of posts) {
      if (post.videos && post.videos.length > 0) {
        const videoId = post.videos[0];
        const video = await this.videoService.findOne(videoId.toString());

        (post as any).videoUrl = video ? video.url : null;
      } else {
        (post as any).videoUrl = null;
      }
    }

    return posts;
  }
  async findAll(): Promise<any[]> {
    // Récupération des posts avec les vidéos associées
    const posts = await this.postModel.find().exec();

    for (const post of posts) {
      // Vérification si un utilisateur est associé au post
      if (post.user) {
        // console.log("1111111",post.user)
        // Recherche de l'utilisateur par ID
        const user = await this.userModel.findById(post.user).exec();
        if (user) {
          // Construction du champ userName
          const userName = `${user.name || ''} ${user.lastname || ''}`.trim();
          const photoUrl = user.photoUrl || '';

          // Ajout des informations utilisateur au post
          (post as any).userName = userName;
          (post as any).photoUrl = photoUrl;
        } else {
          // Utilisateur introuvable
          (post as any).userName = null;
          (post as any).photoUrl = null;
        }
      } else {
        // Aucun utilisateur associé au post
        (post as any).userName = null;
        (post as any).photoUrl = null;
      }

      // Gestion des vidéos associées
      if (post.videos && post.videos.length > 0) {
        // Si plusieurs vidéos sont associées, prendre la première pour l'exemple
        const video = await this.videoService.findOne(post.videos[0].toString());
        (post as any).videoUrl = video ? video.url : null;
      } else {
        (post as any).videoUrl = null;
      }
    }

    // Transformation en objets simples pour éviter les références circulaires
    return posts.map(post => ({
      ...post.toObject(),
      userName: (post as any).userName, // Champ supplémentaire
      photoUrl: (post as any).photoUrl, // Champ supplémentaire
      videoUrl: (post as any).videoUrl,
      statusCode: "200",
    }))

  }
  async SavedPost(idUser: string): Promise<any[]> {
    // Récupération de l'utilisateur avec ses posts
    const user = await this.userModel.findById(idUser).populate('savedPost').exec();
    if (!user || !user.savedPost) {
      throw new Error("Utilisateur introuvable ou aucun post sauvegardé");
    }

    const posts = user.savedPost; // `savedPost` est déjà peuplé avec `populate`

    // Utilisation de Promise.all pour enrichir les posts
    const enrichedPosts = await Promise.all(
        posts.map(async (post: any) => {
          const enrichedPost: any = { ...post }; // Clonage de l'objet, pas besoin de `toObject`

          // Gestion des informations utilisateur associées
          if (post.user) {
            const postUser = await this.userModel.findById(post.user).exec();
            if (postUser) {
              enrichedPost.userName = `${postUser.name || ''} ${postUser.lastname || ''}`.trim();
              enrichedPost.photoUrl = postUser.photoUrl || '';
            } else {
              enrichedPost.userName = null;
              enrichedPost.photoUrl = null;
            }
          } else {
            enrichedPost.userName = null;
            enrichedPost.photoUrl = null;
          }

          // Gestion des vidéos associées
          if (post.videos && post.videos.length > 0) {
            const video = await this.videoService.findOne(post.videos[0].toString());
            enrichedPost.videoUrl = video ? video.url : null;
          } else {
            enrichedPost.videoUrl = null;
          }

          return enrichedPost;
        })
    );

    console.log("yyyyyyy" + enrichedPosts.length)
    return enrichedPosts;
  }

  async removeSavedPost(userId: string, postId: string): Promise<void> {
    // Récupérer l'utilisateur avec ses posts sauvegardés
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    // Vérifier si le post existe dans les sauvegardes
    const savedPostIndex = user.savedPost.findIndex(
        (post: any) => post._id.toString() === postId
    );

    if (savedPostIndex === -1) {
      throw new Error("Post non trouvé dans les sauvegardes");
    }

    // Supprimer le post de la liste `savedPost`
    user.savedPost.splice(savedPostIndex, 1);

    // Sauvegarder les modifications
    await user.save();
  }

  async removeAllSavedPosts(userId: string): Promise<void> {
    // Récupérer l'utilisateur par son ID
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    // Vider le tableau `savedPost`
    user.savedPost = [];

    // Sauvegarder les modifications
    await user.save();
  }



  async findOne(id: string): Promise<Post | null> {
    // Convertir l'ID en ObjectId si nécessaire
    const postId = new Types.ObjectId(id);

    // Trouver un post par son _id
    return this.postModel.findById(postId).exec();
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    // Mettre à jour un post par son ID
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Post | null> {
    // Supprimer un post par son ID
    return this.postModel.findByIdAndDelete(id).exec();
  }
  async like(id: string): Promise<Post | null> {
    console.log("aaaaaa")
    // Incrémenter nbLikes de +1
    return this.postModel.findByIdAndUpdate(
        id,
        { $inc: { nbLikes: 1 } }, // $inc incrémente la valeur de nbLikes
        { new: true } // Retourner le post mis à jour

    ).exec();
  }

  async dislike(id: string): Promise<Post | null> {
    // Trouver le post par son ID
    const post = await this.findOne(id);

    if (!post) {
      throw new Error('Post not found'); // Gérer le cas où le post n'existe pas
    }

    // Vérifier si le nbLikes est déjà à 0
    if (post.nbLikes === 0) {
      // Si nbLikes est 0, ne pas décrémenter
      return this.postModel.findByIdAndUpdate(
          id,
          { nbLikes: 0 }, // Fixer explicitement nbLikes à 0
          { new: true }   // Retourner le document mis à jour
      ).exec();
    } else {
      // Si nbLikes est supérieur à 0, décrémenter de 1
      return this.postModel.findByIdAndUpdate(
          id,
          { $inc: { nbLikes: -1 } }, // Décrémenter nbLikes
          { new: true }             // Retourner le document mis à jour
      ).exec();
    }
  }



}
