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
import {AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
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

  @Get('/confirme/:email')
  async confirme(@Param('email') email: string) {
    console.log(1111)
    return this.userService.confirme(email);
  }



  @Put('update/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async updateProfile(
      @Param('id') id: string,
      @Body() updateProfileDto: UpdateUserDto,
      @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    let photoUrl = '';
    let videoUrl = '';

    // Extraire les fichiers spécifiques
    const photo = files.find(file => file.fieldname === 'photoUrl');
    const video = files.find(file => file.fieldname === 'video');

    console.log("1111111111111" + video)
    if (photo) {
      photoUrl = await this.uploadFileService.uploadImageA(photo);
      updateProfileDto.photoUrl = photoUrl;
    }

    if (video) {
      videoUrl = await this.uploadFileService.uploadVideo(video);
    }

    // Appelle le service pour mettre à jour le profil dans la base de données
    const updatedUser = await this.userService.updateUser(id, updateProfileDto, videoUrl);

    return {
      posts: updatedUser.posts,
      id: updatedUser.id,
      photoUrl: updatedUser.photoUrl,
    };
  }
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
