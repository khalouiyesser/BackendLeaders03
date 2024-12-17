// import { Module } from '@nestjs/common';
// import { PostService } from './post.service';
// import { PostController } from './post.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Post, PostSchema } from './entities/post.entity'; // Importation correcte du modèle et du schéma
// // import { User, UserSchema } from '../user/entities/user.entity'; // Importation du modèle User
// import { UserModule } from '../user/user.module';
// import { User, UserSchema } from '../auth/schemas/user.schema';
// import {VideoService} from "../video/video.service"; // Importation du UserModule pour l'injection
//
//
// @Module({
//   controllers: [PostController],
//   providers: [PostService,VideoService],
//   imports: [
//     MongooseModule.forFeature([ // Ajout du modèle Post
//       {
//         name: Post.name,
//         schema: PostSchema,
//       },
//     ]),
//     MongooseModule.forFeature([ // Ajout du modèle User
//       {
//         name: User.name,
//         schema: UserSchema,
//       },
//     ]),
//     UserModule, // Importation de UserModule pour permettre l'accès au modèle User
//   ],
// })
// export class PostModule {}
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { VideoModule } from '../video/video.module';
import {ClaudeApi} from "../services/Claude.service";
import {UserService} from "../user/user.service";  // Ajoutez cette ligne pour importer VideoModule

@Module({
  controllers: [PostController],
  providers: [PostService,ClaudeApi,UserService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    UserModule,
    VideoModule,  // Ajoutez VideoModule ici
  ],
  exports: [MongooseModule,PostService],
})
export class PostModule {}
