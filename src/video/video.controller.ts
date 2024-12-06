// video.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { UploadFileService } from '../services/uploadFile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatGptService } from '../services/ChatGptService.service';
import { TranscriptionService } from '../services/transcription.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GptDto } from '../auth/schemas/Gpt.dto';
// import { Query } from 'mongoose';


@ApiTags('Video')
@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly uploadFileService: UploadFileService,
    private readonly chatGptService: ChatGptService, // Injection du service ChatGpt
    private readonly transcriptionService: TranscriptionService,
  ) {}

  // constructor(private readonly videoService: VideoService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // 'file' est le nom du champ contenant le fichier
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    return await this.videoService.create(file, createVideoDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return await this.uploadFileService.uploadVideo(file);
  }


  @Get()
  findAll() {
    return this.videoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(id);
  }

  // @Post('chatgpt')
  // async sendMessageToChatGpt(@Body('message') message: string) {
  //   const response = await this.chatGptService.sendMessageToApi(message);
  //   return response;
  // }

  @ApiOperation({ summary: 'Générer des surveys' })
  @Post('Survey')
  async getQuestions(@Body() body: GptDto) {
    const { offer } = body;  // Extraire l'offre du body
    const questions = await this.chatGptService.generateQuestionsForOffer(offer);
    return questions;
  }
  @Post('extract-text')
  async extractText(@Body('url') url: string): Promise<{ transcription: string }> {
    const transcription = await this.videoService.extractTextFromVideo(url);
    return { transcription };
  }

}
