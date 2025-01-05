import { Injectable } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Postuler} from "../postuler/entities/postuler.entity";
import {Model} from "mongoose";
import {User} from "../auth/schemas/user.schema";
import {Post} from "../post/entities/post.entity";
import {ClaudeApi} from "../services/Claude.service";
import {PostService} from "../post/post.service";
import {UploadFileService} from "../services/uploadFile.service";
import {Interview} from "./entities/interview.entity";

@Injectable()
export class InterviewService {

  constructor( @InjectModel(Interview.name) private readonly interviewModel: Model<Interview>,
  ) {
  }


  create(createInterviewDto: CreateInterviewDto) {
    return this.interviewModel.create(createInterviewDto);
  }

  findAll() {
    return `This action returns all interview`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interview`;
  }

  update(id: number, updateInterviewDto: UpdateInterviewDto) {
    return `This action updates a #${id} interview`;
  }

  remove(id: number) {
    return `This action removes a #${id} interview`;
  }
}
