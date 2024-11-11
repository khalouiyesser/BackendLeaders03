import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Education, EducationSchema } from './entities/education.entity';

@Module({
  controllers: [EducationController],
  providers: [EducationService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Education.name,
        schema: EducationSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class EducationModule {}
