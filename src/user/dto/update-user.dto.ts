import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { SignupDto } from '../../auth/dtos/signup.dto';

export class UpdateUserDto extends PartialType(SignupDto) {}
