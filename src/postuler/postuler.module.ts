import { Module } from '@nestjs/common';
import { PostulerService } from './postuler.service';
import { PostulerController } from './postuler.controller';
import {MongooseModule} from "@nestjs/mongoose";

import {Postuler, PostulerSchema} from "./entities/postuler.entity";
import {User, UserSchema} from "../auth/schemas/user.schema";
import {Post, PostSchema} from "../post/entities/post.entity";
import {ClaudeApi} from "../services/Claude.service";
import {PostModule} from "../post/post.module";
// import {PostService} from "../post/post.service";

@Module({
  controllers: [PostulerController],
  providers: [PostulerService,ClaudeApi],
  imports: [
    MongooseModule.forFeature([
      {
        name: Postuler.name,
        schema: PostulerSchema,
      },

    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },

    ]),
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },

    ]),
      PostModule,
  ],

  exports: [MongooseModule],
})
export class PostulerModule {}
