import { Injectable } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Education } from './entities/education.entity';
import { CreatePostDto } from '../post/dto/create-post.dto';

@Injectable()
export class EducationService {

  constructor(
    @InjectModel(Education.name) private readonly educationModel: Model<Education>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async create(createEducationDto: CreateEducationDto) : Promise<Education> {
    // const {title, user,videos,content} =CreatePostDto
    const {Diplome,lieu,anneeFin,anneeDebut,user} = createEducationDto;
    // Créer une nouvelle instance de Post avec les données du DTO
    const newPost = new this.educationModel(createEducationDto);

    // Ajouter l'ID de l'utilisateur à la propriété 'userId' du post
    // newPost.user = userId;  // Utilise l'ID de l'utilisateur passé par le guard

    // Sauvegarder le post dans la base de données
    const createdEducation = await newPost.save();

    // Optionnel : Ajouter le post à l'utilisateur (si tu veux garder cette relation)
    // Si tu ne veux pas lier le post à un utilisateur, tu peux ignorer cette ligne
    await this.userModel.findByIdAndUpdate(user, { $push: { educations: createdEducation} });

    return createdEducation;
  }



  findAll() {
    return `This action returns all education`;
  }

  findOne(id: string) {
    return `This action returns a #${id} education`;
  }

  update(id: string, updateEducationDto: UpdateEducationDto) {
    return `This action updates a #${id} education`;
  }

  remove(id: string) {
    return `This action removes a #${id} education`;
  }
}
