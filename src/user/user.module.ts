import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
// import { User } from './entities/user.entity';
import { User, UserSchema } from '../auth/schemas/user.schema';
// import { User, UserSchema } from './schemas/user.schema'; // Assurez-vous que le chemin est correct

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
