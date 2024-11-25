import { Injectable } from '@nestjs/common';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';

@Injectable()
export class CommentaireService {
  create(createCommentaireDto: CreateCommentaireDto) {
    return createCommentaireDto;
  }

  findAll() {
    return `This action returns all commentaire`;
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
