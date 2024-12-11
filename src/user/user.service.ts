import {Injectable, NotFoundException} from '@nestjs/common';

import { exec } from 'child_process';
import { promisify } from 'util';
import {UpdateUserDto} from './dto/update-user.dto';
// import { User } from './entities/user.entity';
import {Model} from 'mongoose';
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

  async updateUser(id: string, updateProfileDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateProfileDto, { new: true });
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }


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

    // Ajouter l'objet complet du post au champ savedPost
    user.savedPost.push(fullPost);

    console.log(user)
    // Sauvegarder l'utilisateur avec la mise à jour
    await user.save();

    // Retourner l'utilisateur mis à jour (ou une partie spécifique si nécessaire)
    return "user";
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
