import {Injectable, NotFoundException} from '@nestjs/common';

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

    // Sauvegarder l'utilisateur avec la mise à jour
    await user.save();

    // Retourner l'utilisateur mis à jour (ou une partie spécifique si nécessaire)
    return user;
  }


}
