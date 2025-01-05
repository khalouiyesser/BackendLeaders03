import {Injectable} from '@nestjs/common';
import {CreateCalenderDto} from './dto/create-calender.dto';
import {UpdateCalenderDto} from './dto/update-calender.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Calender} from "./entities/calender.entity";

@Injectable()
export class CalenderService {
  constructor(

      @InjectModel(Calender.name) private readonly calenderModel: Model<Calender>,


  ) {}
  create(createCalenderDto: CreateCalenderDto) {
    console.log(createCalenderDto)
    this.calenderModel.create(createCalenderDto);
    return "This action adds a new calender";
  }

  findAll() {
    return `This action returns all calender`;
  }

  findOne(id: number) {
    return `This action returns a #${id} calender`;
  }

 async findByUser(id: string) {

   return this.calenderModel.find({user: id});
  }
  update(id: number, updateCalenderDto: UpdateCalenderDto) {
    return `This action updates a #${id} calender`;
  }

  remove(id: number) {
    return `This action removes a #${id} calender`;
  }
}
