import { Module } from '@nestjs/common';
import { CalenderService } from './calender.service';
import { CalenderController } from './calender.controller';
import {MongooseModule} from "@nestjs/mongoose";

import {Calender, calenderSchema} from "./entities/calender.entity";


@Module({
  controllers: [CalenderController],
  imports: [
    MongooseModule.forFeature([
      { name: Calender.name, schema: calenderSchema },
    ]),

  ],
  providers: [CalenderService]
})
export class CalenderModule {}
