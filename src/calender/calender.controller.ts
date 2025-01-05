import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CalenderService } from './calender.service';
import { CreateCalenderDto } from './dto/create-calender.dto';
import { UpdateCalenderDto } from './dto/update-calender.dto';

@Controller('calender')
export class CalenderController {
  constructor(private readonly calenderService: CalenderService) {}

  @Post()
  create(@Body() createCalenderDto: CreateCalenderDto) {
    return this.calenderService.create(createCalenderDto);
  }

  @Get()
  findAll() {
    return this.calenderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calenderService.findByUser(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCalenderDto: UpdateCalenderDto) {
    return this.calenderService.update(+id, updateCalenderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calenderService.remove(+id);
  }
}
