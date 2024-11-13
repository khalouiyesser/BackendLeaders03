import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadFileService } from '../services/uploadFile.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly uploadFileService: UploadFileService) {}
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


  @Put(':id')
  @UseInterceptors(FileInterceptor('photoUrl'))
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateUserDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    // Upload la photo si elle est présente
    // Upload la photo si elle est présente
    if (photo) {
      const photoUrl = await this.uploadFileService.uploadVideo(photo);
      updateProfileDto.photoUrl = photoUrl;
    }

    // Appelle le service pour mettre à jour le profil dans la base de données
    const updatedUser = await this.userService.updateUser(id, updateProfileDto);

    return {
      message: 'Profile updated successfully',
      data: updatedUser,
    };
  }


}
