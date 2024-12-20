import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentaireService } from './commentaire.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';

@Controller('commentaire')
export class CommentaireController {
  constructor(private readonly commentaireService: CommentaireService) {}

  @Post()
  create(@Body() createCommentaireDto: CreateCommentaireDto) {
    console.log(createCommentaireDto)
   return this.commentaireService.create(createCommentaireDto);
  }



  /*
  create commentaire avec videoUrl lezmeek taady fel body haka
  {
    "videoUrl" : "https://res.cloudinary.com/dcjtuxprn/video/upload/v1734447618/UploadLeaders/1000014911.mp4",
    "userId": "67322ac07b0ef3c99e6a288c",
    "contenue": "Bonjour les amis comment ça va "
  }
  */

  @Post('ios')
  createIos(@Body('videoUrl') videoUrl: string,@Body('userId') userId: string,@Body('contenue') contenu: string ) {
    return this.commentaireService.createIos(videoUrl,userId,contenu);
  }

  @Get()
  findAll() {

    return this.commentaireService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentaireService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentaireDto: UpdateCommentaireDto) {
    return this.commentaireService.update(id, updateCommentaireDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentaireService.remove(id);
  }


  // get les commentaire par post avec videoUrl
  // lezmeek taady fel body videoUrl mte3 l post edhika
  /*
  {
    "videoUrl" : "https://res.cloudinary.com/dcjtuxprn/video/upload/v1734447618/UploadLeaders/1000014911.mp4"
   }
   */
  @Get('z/Getios/:id')
  getParPost(@Param('id') id: string) {
    return this.commentaireService.findCOmmentParPosts(id);
  }
  @Get('/Getios/:postId')
  getParPostAndroid(@Param('postId') videoUrl: string) {
    return this.commentaireService.findCOmmentParPosts(videoUrl);
  }



}
