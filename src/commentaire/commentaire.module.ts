import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {Commentaire, CommentaireSchema} from "./entities/commentaire.entity";
import {UserModule} from "../user/user.module";
import {PostModule} from "../post/post.module";
import {CommentaireController} from "./commentaire.controller";
import {CommentaireService} from "./commentaire.service";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Commentaire.name, schema: CommentaireSchema },
    ]),
    UserModule, // Vérifie cette importation
    PostModule, // Vérifie cette importation
  ],
  controllers: [CommentaireController],
  providers: [CommentaireService],

})
export class CommentaireModule {}

