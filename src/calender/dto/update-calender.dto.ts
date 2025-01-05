import { PartialType } from '@nestjs/swagger';
import { CreateCalenderDto } from './create-calender.dto';

export class UpdateCalenderDto extends PartialType(CreateCalenderDto) {}
