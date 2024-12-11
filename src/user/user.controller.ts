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
  UploadedFiles
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadFileService } from '../services/uploadFile.service';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
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




  @Put(':id')
  @UseInterceptors(FilesInterceptor('files', 2)) // Limite à 2 fichiers
  async updateProfile(
      @Param('id') id: string,
      @Body() updateProfileDto: UpdateUserDto,
      @UploadedFiles() files?: Express.Multer.File[],
  ) {
    let photoUrl: string | undefined;
    let videoUrl: string | undefined;

    // Parcours des fichiers pour déterminer leur type
    for (const file of files) {
      if (file.mimetype.startsWith('image/')) {
        photoUrl = await this.uploadFileService.uploadImageA(file);
      } else if (file.mimetype.startsWith('video/')) {
        videoUrl = await this.uploadFileService.uploadVideo(file); // Implémentez uploadVideo
      }
    }

    // Mise à jour des URL dans le DTO
    if (photoUrl) {
      updateProfileDto.photoUrl = photoUrl;
    }
    if (videoUrl) {
      updateProfileDto.cv = videoUrl;
      updateProfileDto.profileDescription = await this.userService.transcribeVideo(videoUrl);
      console.log(updateProfileDto.profileDescription)
    }


    // Mise à jour du profil dans la base de données
    const updatedUser = await this.userService.updateUser(id, updateProfileDto);

    return {
      id: updatedUser.id,
      photoUrl: updatedUser.photoUrl,
      videoUrl: updatedUser.cv,
      posts: updatedUser.posts,
      "desc" : updatedUser.profileDescription,
    };
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
