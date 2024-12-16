import { PartialType } from '@nestjs/swagger';
import { CreatePostulerDto } from './create-postuler.dto';

export class UpdatePostulerDto extends PartialType(CreatePostulerDto) {}
