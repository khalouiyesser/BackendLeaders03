import {Injectable, NotFoundException} from '@nestjs/common';

import {exec} from 'child_process';
import {promisify} from 'util';
import {UpdateUserDto} from './dto/update-user.dto';
// import { User } from './entities/user.entity';
import {Model, Types} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {SignupDto} from '../auth/dtos/signup.dto';
import {User} from '../auth/schemas/user.schema';
import {Post} from "../post/entities/post.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,

  ) {}
  // Convertir exec en fonction async
  public execAsync = promisify(exec);
  create(createUserDto: SignupDto) {
    return 'This action adds a new user';
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    // Utilisation de findOne pour récupérer l'utilisateur par son ID
    return this.userModel.findOne({ _id: id }).exec();
  }

  async updateUser(id: string, updateProfileDto: UpdateUserDto, videoUrl: string): Promise<User> {
    // Vérification si l'utilisateur existe
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found.`);
    }

    console.log("User found, proceeding with update.");

    // Transcrire la vidéo si une URL est fournie
    if (videoUrl) {
      updateProfileDto.profileDescription = await this.transcribeVideo(videoUrl);
    }

    console.log(`Updated profile description: ${updateProfileDto.profileDescription}`);

    // Mise à jour de l'utilisateur
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateProfileDto, { new: true });
    if (!updatedUser) {
      throw new Error(`Failed to update user with id ${updatedUser.name} ${updatedUser.lastname}.`);
    }
    return updatedUser;
  }

  async confirme(email: string) {
    console.log('Début de la vérification de l’utilisateur par email');

    try {
      // Trouver et mettre à jour l'utilisateur en réglant le champ `verified` à `true`
      const user = await this.userModel.findOneAndUpdate(
          { email: email }, // Recherche par email
          { verified: true }, // Met à jour le champ `verified`
          { new: true } // Retourne l'utilisateur mis à jour
      );

      // Vérifier si l'utilisateur existe
      if (!user) {
        console.log('Utilisateur non trouvé');
        throw new Error('Utilisateur introuvable');
      }

      console.log('Utilisateur vérifié avec succès');
      return 'Votre email a été vérifié avec succès.';
    } catch (error) {
      console.error('Erreur lors de la vérification de l’utilisateur :', error.message);
      throw new Error('Une erreur est survenue lors de la vérification de l’email.');
    }
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async follow(userId: string, userToFollowId: string): Promise<void> {
    // Récupérer les utilisateurs
    const user = await this.userModel.findById(userId).exec();
    const userToFollow = await this.userModel.findById(userToFollowId).exec();

    if (!user || !userToFollow) {
      throw new Error('User or user to follow not found');
    }

    // Vérification si l'utilisateur à suivre est déjà dans la liste `follow`
    if (!user.follow.some((id: Types.ObjectId) => id.equals(userToFollow.id))) {
      user.follow.push(userToFollow.id); // Stocker l'ID
    }

    // Vérification si le suiveur est déjà dans la liste `followers`
    if (!userToFollow.followers.some((id: Types.ObjectId) => id.equals(user.id))) {
      userToFollow.followers.push(user.id); // Stocker l'ID
    }

    // Sauvegarder les deux utilisateurs
    await user.save();
    await userToFollow.save();
  }


  async getUserFollowData(userId: string): Promise<{ follow: any[]; followers: any[] }> {
    // Récupérer l'utilisateur avec les relations peuplées
    const user = await this.userModel
        .findById(userId)
        .populate('follow', 'name lastname photoUrl') // Charger seulement les champs nécessaires
        .populate('followers', 'name lastname photoUrl') // Charger seulement les champs nécessaires
        .exec();

    if (!user) {
      throw new Error('User not found');
    }

    // Construire les résultats
    const followData = user.follow.map((followedUser: any) => ({
      fullName: `${followedUser.name} ${followedUser.lastname}`,
      photoUrl: followedUser.photoUrl,
    }));

    const followersData = user.followers.map((follower: any) => ({
      fullName: `${follower.name} ${follower.lastname}`,
      photoUrl: follower.photoUrl,
    }));

    return { follow: followData, followers: followersData };
  }

/*
  async savePost(userId: string, postId: string) {
    // Rechercher le post complet par son ID
    const fullPost = await this.postModel.findById(postId).exec();
    if (!fullPost) {
      throw new NotFoundException('Post not found');
    }

    // Rechercher l'utilisateur par son ID
    const user = await this.userModel.findById(userId).exec();
    const posts = user.savedPost;


    if (!user) {
      throw new NotFoundException('User not found');
    }


    console.log(user)
    // Sauvegarder l'utilisateur avec la mise à jour
    for (const post of posts) {
      if (post._id.toString() === postId) {
        return "post already saved";
      }else {
// Ajouter l'objet complet du post au champ savedPost
        user.savedPost.push(fullPost);
        await user.save();
      }
    }


    // Retourner l'utilisateur mis à jour (ou une partie spécifique si nécessaire)
    return "user";
  }
*/
  async savePost(userId: string, postId: string) {
    // Rechercher le post complet par son ID
    const fullPost = await this.postModel.findById(postId).exec();
    if (!fullPost) {
      throw new NotFoundException('Post not found');
    }

    // Rechercher l'utilisateur par son ID
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Vérifier si le post est déjà sauvegardé
    const isPostSaved = user.savedPost.some(
        (post) => post.content === fullPost.content
    );

    if (isPostSaved) {
      return 'Post already saved';
    }

    // Ajouter l'objet complet du post au champ savedPost
    user.savedPost.push(fullPost);

    // Sauvegarder l'utilisateur avec la mise à jour
    await user.save();

    // Retourner un message de succès
    return 'Post saved successfully';
  }


  async transcribeVideo(videoUrl: string): Promise<string> {
    try {

      console.log("1111111111111111111111111")
      // Commande pour exécuter le script Python avec le videoUrl
      const scriptPath = 'C:\\Users\\Yesser\\WebstormProjects\\BackendLeaders03\\src\\services\\VideoToText.py'; // Remplacez par le chemin de votre script Python
      console.log("22222222222222222222222222222222222222222222222222222")
      const command = `python ${scriptPath} ${videoUrl}`;
      console.log("3333333333333333333333333333333333333333333333")
      // Exécution du script Python
      const { stdout, stderr } = await this.execAsync(command);

      console.log(444444)

      // Vérification des erreurs
      if (stderr) {
        console.error('Erreur du script Python :', stderr);
        throw new Error('Une erreur s\'est produite lors de l\'exécution du script Python.');
      }

      console.log('Résultat du script Python :', stdout);

      // Retourne le texte transcrit
      return stdout.trim();
    } catch (error) {
      console.error('Erreur lors de la transcription de la vidéo :', error);
      throw new Error('Impossible de transcrire la vidéo.');
    }
  }

}
