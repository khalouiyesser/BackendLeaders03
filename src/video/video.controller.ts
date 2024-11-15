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
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
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

  // @Post('analyze')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     dest: './uploads',
  //     fileFilter: (req, file, callback) => {
  //       // Vérifier le type MIME du fichier
  //       if (!file.mimetype.includes('audio/')) {
  //         return callback(new Error('Only audio files are allowed!'), false);
  //       }
  //       callback(null, true);
  //     },
  //     limits: {
  //       fileSize: 1024 * 1024 * 10, // Limite à 10MB par exemple
  //     },
  //   })
  // )
  //
  // async analyzeVideo(@UploadedFile() file: Express.Multer.File) {
  //   try {
  //     if (!file) {
  //       throw new Error('No audio file uploaded');
  //     }
  //
  //     console.log('File information:', {
  //       originalname: file.originalname,
  //       path: file.path,
  //       mimetype: file.mimetype,
  //       size: file.size
  //     });
  //
  //     // Étape 1 : Transcrire l'audio
  //     const transcription = await this.transcriptionService.transcribeVideo(file.path);
  //
  //     // Si la transcription est vide, arrêter le processus
  //     if (!transcription) {
  //       throw new Error('No transcription generated');
  //     }
  //
  //     // Étape 2 : Envoyer la transcription à ChatGPT
  //     const prompt = `Voici une transcription d'une vidéo : "${transcription}". Peux-tu résumer le sujet de cette vidéo en quelques mots ?`;
  //     const response = await this.chatGptService.sendMessageToApi(prompt);
  //
  //     return {
  //       success: true,
  //       transcription,
  //       sujet: response
  //     };
  //
  //   } catch (error) {
  //     console.error('Error in analyzeVideo:', error);
  //     return {success: false,
  //       error: error.message
  //     };
  //   }
  // }


}
