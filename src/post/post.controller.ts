import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors, NotFoundException, Put
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { ApiTags } from '@nestjs/swagger';
import {FileInterceptor} from "@nestjs/platform-express";
import {ClaudeApi} from "../services/Claude.service";
import {UserService} from "../user/user.service";
// import { User } from '../user/entities/user.entity';
@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,
              private readonly claudeService: ClaudeApi,
              private readonly userService: UserService) {}




  // badelett feeha lahnee f reponse
  @Get('survey/:id') // Utilisez ':' pour spécifier une variable dans l'URL
  async getSurvey(@Param('id') id: string) {
    const post = await this.postService.findOne(id);

    return {survey : post.survey, post : id};
  }

  @Put('editSurvey/:id') // Utilisez ':' pour spécifier une variable dans l'URL
  async editSurveys(@Param('id') id: string,@Body('survey') survey: string[]) {
    const post = await this.postService.updateSurveys(id,survey);
    return post
  }

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
    console.log(createPostDto)
    // Appeler le service pour créer un post avec vidéo
    return await this.postService.createWithVideo(file, createPostDto);

  }
  @Post("claude/:idPost/:description")
  async generateQuestions(@Param('idPost') idPost: string,@Param('description') description: string) {
    try {
      // Générer les questions
      console.log("claude1")
      const questions = await this.claudeService.generateQuestions(description);

      // Extraction des variables individuelles
      const question1 = questions.question1;
      const question2 = questions.question2;
      const question3 = questions.question3;
      const question4 = questions.question4;
      const question5 = questions.question5;
      const question6 = questions.question6;
      const question7 = questions.question7;
      const question8 = questions.question8;
      const question9 = questions.question9;
      const question10 = questions.question10;
      // Retourner un objet avec les questions individuelles

      const survey = [
        questions.question1,
        questions.question2,
        questions.question3,
        questions.question4,
        questions.question5,
        questions.question6,
        questions.question7,
        questions.question8,
        questions.question9,
        questions.question10,
      ];

      const a = this.postService.updatePost(idPost,survey)



      return {
        a,
        question1,
        question2,
        question3,
        question4,
        question5,
        question6,
        question7,
        question8,
        question9,
        question10,

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
    console.log(posts.length)

    return posts;
  }


  @Get()
  findAll() {
    return this.postService.findAll();

  }

  @Get('savedPosts/:id')
  findSavedPost(@Param('id') id: string)  {
    return this.postService.SavedPost(id);
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

  @Delete('romovePosts/:id')
  removeAllSavedPosts(@Param('id') id: string) {
    return this.postService.removeAllSavedPosts(id);
  }
  @Delete('deleteOne/:idUser/:idPost')
  removeOneSavedPost(@Param('idUser') idU: string,@Param('idPost') idP: string) {
    return this.postService.removeSavedPost(idU,idP);
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

  /*
  like l ios lezmeek t7ot fel body videoUrl kif haka syntaxe
  {
 "videoUrl": "https://res.cloudinary.com/dcjtuxprn/video/upload/v1734447618/UploadLeaders/1000014911.mp4"
}


resultat haka
{
    "nombreLikes": 3
}
   */
  @Patch('zaama/ios/like')
  async likeIos(@Body('videoUrl') videoUrl: string) {
    console.log("Video URL:", videoUrl);
    return this.postService.likeIos(videoUrl);
  }

  // nafess like bedhabett
  @Patch('zaama/ios/deslike')
  async deslikeIos(@Body('videoUrl') videoUrl: string) {
    console.log("Video URL:", videoUrl);
    return this.postService.deslikeIos(videoUrl);
  }





}
