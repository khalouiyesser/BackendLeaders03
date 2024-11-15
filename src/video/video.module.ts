import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
// import { UploadFileService } from './upload-file.service'; // Importez directement le service
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from './entities/video.entity';
import { UploadFileService } from '../services/uploadFile.service';
import { ChatGptService } from '../services/ChatGptService.service';
import { TranscriptionService } from '../services/transcription.service';
// import { UploadFileService } from '../services/uploadFile.service';
// import { Video, VideoSchema } from './schemas/video.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
  ],
  controllers: [VideoController],
  providers: [VideoService,UploadFileService,ChatGptService,TranscriptionService], // Ajoutez UploadFileService ici comme provider9
})
export class VideoModule {}
