import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
// import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>
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
