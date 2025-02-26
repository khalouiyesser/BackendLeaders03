import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostulerService } from './postuler.service';
import { CreatePostulerDto } from './dto/create-postuler.dto';
import { UpdatePostulerDto } from './dto/update-postuler.dto';
import { log } from 'node:console';

@Controller('postuler')
export class PostulerController {
  constructor(private readonly postulerService: PostulerService,
              ) {}

  @Post()
  create(@Body() createPostulerDto: CreatePostulerDto) {

    console.log("11111111111111111111")

    return this.postulerService.create(createPostulerDto);
  }

  @Get()
  findAll() {
    return this.postulerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postulerService.findOne(+id);
  }






  /////// statistique
   /*

   le retour est :
   [
    {
        "postName": "hello",
        "postulations": 8
    },
    {
        "postName": "jjjd",
        "postulations": 0
    },
    {
        "postName": "hshsh",
        "postulations": 0
    },
    {
        "postName": "hshsh",
        "postulations": 0
    }
  ]

    */



  @Get('stats/:id')
  stat(@Param('id') id: string) {
    return this.postulerService.stats(id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostulerDto: UpdatePostulerDto) {
    return this.postulerService.update(+id, updatePostulerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postulerService.remove(+id);
  }

  @Get('usersByPost/:id')
  getUserPostuler(@Param('id') id: string) {
    return this.postulerService.findCandidatByPost(id);
  }


  @Get('interview/:id')
  async Interview(@Param('id') id: string) {
    return await this.postulerService.interview(id)
  }

  @Get('applied/:id')
  async applied(@Param('id') id: string) {
    console.log("yess i point on it ")
    console.log(id)
    return await this.postulerService.postulerByUser(id)
  }


  @Get('inetviewQuestions/:id')
  async questions(@Param('id') id: string) {
    

    // const post =
    return await this.postulerService.questions(id)
  }


  @Post('ajouterResponse')
  async ajouterResponse(@Body('idUser') idUser: string, @Body('idPost') idPost: string,@Body('response') response: string[]) {


    // const post =
    return await this.postulerService.ajoutResponses(idUser,idPost,response)
  }

}
