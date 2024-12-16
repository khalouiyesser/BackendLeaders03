import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostulerService } from './postuler.service';
import { CreatePostulerDto } from './dto/create-postuler.dto';
import { UpdatePostulerDto } from './dto/update-postuler.dto';

@Controller('postuler')
export class PostulerController {
  constructor(private readonly postulerService: PostulerService) {}

  @Post()
  create(@Body() createPostulerDto: CreatePostulerDto) {
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
}
