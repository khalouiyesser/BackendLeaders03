import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Put,
  UploadedFiles, HttpStatus, HttpException
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadFileService } from '../services/uploadFile.service';
import {FileFieldsInterceptor, FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import {PostService} from "../post/post.service";



@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly uploadFileService: UploadFileService,
  ) {}
  // constructor(private readonly uploadFileService: UploadFileService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  findAll() {
    return this.userService.findAll();
  }


  @Get('followAndFollowers/:id')
  getFollowers(@Param('id') id: string)  {
    return this.userService.getUserFollowData(id);
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (user) {
      return user;
    } else {
      return "nothing found.";
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }




  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Put('/savePost/:idUser/:idPost')
  async savedPost(@Param('idUser') userId: string, @Param('idPost') postId: string) {
    console.log("userId", userId , " postId", postId);
    return this.userService.savePost(userId, postId);
  }
  @Put('/follow/:idUser/:idUserToFollow')
  async follow(@Param('idUser') userId: string, @Param('idUserToFollow') userToFollow: string) {
    return this.userService.follow(userId, userToFollow);
  }




  //
  // @Put('update/:id')
  // @UseInterceptors(
  //     FileFieldsInterceptor([
  //       { name: 'file', maxCount: 1 }, // Pour l'image
  //       { name: 'file1', maxCount: 1 } // Pour la vidéo
  //     ])
  // )
  // async updateProfile(
  //     @Param('id') id: string,
  //     @Body() updateProfileDto: UpdateUserDto,
  //     @UploadedFiles()
  //         files: {
  //       file?: Express.Multer.File[];
  //       file1?: Express.Multer.File[];
  //     },
  // ) {
  //
  //
  //   console.log("1111111111111111111111")
  //
  //
  //   console.log(updateProfileDto)
  //
  //   console.log(files)
  //
  //   try {
  //     let photoUrl: string | undefined;
  //     let videoUrl: string | undefined;
  //
  //     // Gestion des fichiers (image et vidéo)
  //     if (files.file && files.file[0]) {
  //       photoUrl = await this.uploadFileService.uploadImageA(files.file[0]);
  //     }
  //     if (files.file1 && files.file1[0]) {
  //       videoUrl = await this.uploadFileService.uploadVideo(files.file1[0]);
  //     }
  //
  //     // Mise à jour des URL dans le DTO
  //     if (photoUrl) {
  //       updateProfileDto.photoUrl = photoUrl;
  //     }
  //     if (videoUrl) {
  //       updateProfileDto.cv = videoUrl;
  //
  //       // Transcription de la vidéo pour obtenir une description
  //       const description = await this.userService.transcribeVideo(videoUrl);
  //       updateProfileDto.profileDescription = description || 'Description non disponible';
  //     }
  //
  //     // Mise à jour du profil dans la base de données
  //     const updatedUser = await this.userService.updateUser(id, updateProfileDto);
  //
  //     // Réponse en cas de succès
  //     return {
  //       message: 'Profil mis à jour avec succès',
  //       id: updatedUser.id,
  //       photoUrl: updatedUser.photoUrl,
  //       videoUrl: updatedUser.cv,
  //       posts: updatedUser.posts,
  //       desc: updatedUser.profileDescription,
  //     };
  //   } catch (error) {
  //     // Gestion des erreurs
  //     console.error('Erreur lors de la mise à jour du profil:', error.message);
  //
  //     // Renvoyer une erreur personnalisée au client
  //     throw new HttpException(
  //         {
  //           status: HttpStatus.INTERNAL_SERVER_ERROR,
  //           message: 'Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer plus tard.',
  //         },
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  @Put('update/:id')
  @UseInterceptors(
      FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'file1', maxCount: 1 }
      ])
  )
  async updateProfile(
      @Param('id') id: string,
      @Body() updateProfileDto: UpdateUserDto,
      @UploadedFiles() files: { file?: Express.Multer.File[], file1?: Express.Multer.File[] }
  ) {


    console.log(updateProfileDto)
    console.log(11111)
    if (!files.file && !files.file1) {
      throw new HttpException('Aucun fichier fourni.', HttpStatus.BAD_REQUEST);
    }

    try {
      let photoUrl: string | undefined;
      let videoUrl: string | undefined;

      console.log(videoUrl)

      // Gestion des fichiers
      if (files.file && files.file[0]) {
        console.log("0000000000000000000000000000")
        const file = files.file[0];
        console.log(file)
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
          throw new HttpException('Le fichier image doit être au format JPEG ou PNG', HttpStatus.BAD_REQUEST);
        }
        photoUrl = await this.uploadFileService.uploadImageA(file);
      }

      if (files.file1 && files.file1[0]) {
        console.log("11111111111111111111111111111111111111111111111111111111")
        const video = files.file1[0];
        videoUrl = await this.uploadFileService.uploadVideo(video);

        // Transcription de la vidéo
        const description = await this.userService.transcribeVideo(videoUrl);
        updateProfileDto.profileDescription = description || 'Description non disponible';
      }
      console.log("2222222222222222222222222222222222222")

      // Mise à jour du profil
      const updatedUser = await this.userService.updateUser(id, updateProfileDto);

      console.log(updatedUser)
      return {
        message: 'Profil mis à jour avec succès',
        id: updatedUser.id,
        photoUrl: updatedUser.photoUrl || 'Aucune image téléchargée',
        videoUrl: updatedUser.cv || 'Aucune vidéo téléchargée',
        posts: updatedUser.posts,
        desc: updatedUser.profileDescription || 'Description non disponible',
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error.message);
      throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer plus tard.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  // @Put(':id')
  // @UseInterceptors(FileInterceptor('photoUrl'))
  // async updateProfile(
  //   @Param('id') id: string,
  //   @Body() updateProfileDto: UpdateUserDto,
  //   @UploadedFile() photo?: Express.Multer.File,
  // ) {
  //   // Upload la photo si elle est présente
  //   // Upload la photo si elle est présente
  //   if (photo) {
  //     const photoUrl = await this.uploadFileService.uploadImageA(photo);
  //     updateProfileDto.photoUrl = photoUrl;
  //   }
  //
  //   // Appelle le service pour mettre à jour le profil dans la base de données
  //   const updatedUser = await this.userService.updateUser(id, updateProfileDto);
  //   console.log(updatedUser)
  //   return {
  //       posts: updatedUser.posts,
  //       id: updatedUser.id,
  //       photoUrl: updatedUser.photoUrl,
  //
  //   };
  // }
  // @Put(':id')
  //
  // async updateProfile(
  //   @Param('id') id: string,
  //   @Body() updateProfileDto: UpdateUserDto,
  //
  // ) {
  //
  //
  //
  //   // Appelle le service pour mettre à jour le profil dans la base de données
  //   const updatedUser = await this.userService.updateUser(id, updateProfileDto);
  //
  //   return {
  //     message: 'Profile updated successfully',
  //     data: updatedUser,
  //   };
  // }

}
