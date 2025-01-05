import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import {MongooseModule} from "@nestjs/mongoose";

import {Interview, InterviewSchema} from "./entities/interview.entity";

@Module({
  controllers: [InterviewController],
  providers: [InterviewService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Interview.name,
        schema: InterviewSchema,
      },

    ]),



  ]
})
export class InterviewModule {}
