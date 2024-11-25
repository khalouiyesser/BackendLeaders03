import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { VideoModule } from './video/video.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { EducationModule } from './education/education.module';
import config from './config/config';
import {CommentaireModule} from "./commentaire/commentaire.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    RolesModule,
    VideoModule,
    PostModule,
    UserModule,
    EducationModule,
    CommentaireModule,
  ],
  controllers: [AppController], // PostController n'est plus nécessaire ici
  providers: [AppService], // PostService n'est plus nécessaire ici
})
export class AppModule {}
