import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SignupDto } from '../auth/dtos/signup.dto';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>, // Injection du modèle User
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
}
