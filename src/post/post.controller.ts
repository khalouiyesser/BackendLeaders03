import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../auth/schemas/user.schema';
import { AuthenticationGuard } from '../guards/authentication.guard';
// import { User } from '../user/entities/user.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  // constructor(private readonly postService: PostService) {}

  @Post()
  // @UseGuards(AuthenticationGuard)  // Utilise ton guard pour vérifier le token
  async create(@Body() createPostDto: CreatePostDto) {
    // Passe l'ID de l'utilisateur extrait du token à la méthode create
    return this.postService.create(createPostDto);  // Utilise l'ID de l'utilisateur pour créer le post
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
