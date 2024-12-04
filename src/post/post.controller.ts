import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors, NotFoundException
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { ApiTags } from '@nestjs/swagger';
import {FileInterceptor} from "@nestjs/platform-express";
import {ClaudeApi} from "../services/Claude.service";
// import { User } from '../user/entities/user.entity';
@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,
              private readonly claudeService: ClaudeApi) {}
  // constructor(private readonly postService: PostService) {}

  // @Post()
  // // @UseGuards(AuthenticationGuard)  // Utilise ton guard pour vérifier le token
  // async create(@Body() createPostDto: CreatePostDto) {
  //   // Passe l'ID de l'utilisateur extrait du token à la méthode create
  //   return this.postService.create(createPostDto);  // Utilise l'ID de l'utilisateur pour créer le post
  // }



  @Post()
  @UseInterceptors(FileInterceptor('file')) // Gérer l'upload de fichier
  async create(
      @UploadedFile() file: Express.Multer.File,
      @Body() createPostDto: CreatePostDto
  ) {
    // Appeler le service pour créer un post avec vidéo
    return await this.postService.createWithVideo(file, createPostDto);

  }
  @Post("android")
  @UseInterceptors(FileInterceptor('file')) // Gérer l'upload de fichier
  async PostAndroid(
      @UploadedFile() file: Express.Multer.File,
      @Body() createPostDto: CreatePostDto
  ) {
    // Appeler le service pour créer un post avec vidéo
    return await this.postService.createWithVideo(file, createPostDto);

  }
  @Post("claude/:description")
  async generateQuestions(@Param('description') description: string) {
    try {
      // Générer les questions
      const questions = await this.claudeService.generateQuestions(description);

      // Extraction des variables individuelles
      const question1 = questions.question1;
      const question2 = questions.question2;
      const question3 = questions.question3;
      const question4 = questions.question4;
      const question5 = questions.question5;

      // Retourner un objet avec les questions individuelles
      return {
        question1,
        question2,
        question3,
        question4,
        question5,
        // Vous pouvez également retourner l'objet complet si nécessaire
        // allQuestions: questions
      };
    } catch (error) {
      return {
        error: true,
        message: error.message
      };
    }
  }

  @Get('user/:id') // Utilisez ':' pour spécifier une variable dans l'URL
  async findByUser(@Param('id') id: string) {
    const posts = await this.postService.findByUser(id);

    if (!posts || posts.length === 0) {
      // throw new NotFoundException(`Aucun post trouvé pour l'utilisateur avec l'ID ${id}`);
      return id;
    }
    return posts;
  }


  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  // Route pour liker un post
  @Patch(':id/like')
  async like(@Param('id') id: string){
    return this.postService.like(id);
  }

  // Route pour disliker un post
  @Patch(':id/dislike')
  async dislike(@Param('id') id: string) {
    return this.postService.dislike(id);
  }

}
