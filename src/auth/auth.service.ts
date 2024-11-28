import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { ResetToken } from './schemas/reset-token.schema';
import { MailService } from 'src/services/mail.service';
import { RolesService } from 'src/roles/roles.service';
import { TwilioService } from 'src/services/twilio.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private ResetTokenModel: Model<ResetToken>,
    private jwtService: JwtService,
    private mailService: MailService,
    private rolesService: RolesService,
    private smsService: TwilioService,
  ) { }

  async signup(signupData: SignupDto) {
    const { email, password, name, lastname } = signupData;


    const lowerCaseEmail = email.toLowerCase();
    // Vérifier si l'email est déjà utilisé
    const emailInUse = await this.UserModel.findOne({ lowerCaseEmail });
    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec toutes les informations
    const user = new this.UserModel({
      name,
      lowerCaseEmail,
      password: hashedPassword,
      lastname,
    });

    // Sauvegarder l'utilisateur dans MongoDB
    await user.save();

    // Retourner l'utilisateur avec toutes les informations, sans le mot de passe
    return await this.UserModel.findById(user._id).select('-password').lean();
  }


  async login(credentials: LoginDto) {
    const { email, password } = credentials;
    // const {name , lastname,phoneNumber,codePostal,website,domaine,photoUrl  } = user;
    //Find if user exists by email

    // const
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    //Compare entered password with existing password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong ');
    }

    const {name , lastname,phoneNumber,codePostal,website,domaine,photoUrl,posts  } = user;
    //Generate JWT tokens
    const tokens = await this.generateUserTokens(user);
    return {
      ...tokens,
      name,
      lastname,
      email,
      domaine,
      phoneNumber,
      codePostal,
      website,
      photoUrl,
      userId: user._id,
      posts : posts,
      "statusCode": 200
    };
  }

  async changePassword(userId, oldPassword: string, newPassword: string) {
    //Find the user
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found...');
    }

    //Compare the old password with the password in DB
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    //Change user's password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();
    return user;
  }
  async getUser(id: string) {
    //Check that user exists
    // const user = await this.UserModel.findOne({ id });
    const user = await this.UserModel.findById(id);
    if (user) {
      //If user exists, generate password reset link
   return user;
    }

    return { message: 'nothing' };
  }
  async forgotPassword(email: string) {
    //Check that user exists
    const user = await this.UserModel.findOne({ email });

    if (user) {
      //If user exists, generate password reset link
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);

      const resetToken = nanoid(64);
      await this.ResetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });

      const code = Math.floor(100000 + Math.random() * 900000);
      //Send the link to the user by email
      await this.mailService.sendPasswordResetEmail(email, code);
      return {
        "resetToken": resetToken, "code": code,
        "statusCode": 200
      };
    }

    return { message: 'If this user exists, they will receive an email' };
  }


  async sms(phoneNumber: string) {
    //Check that user exists
    // const user = await this.UserModel.findOne({  async forgotPassword(email: string) {
    //Check that user exists
    const user = await this.UserModel.findOne({ phoneNumber });

    if (user) {

      //If user exists, generate password reset link
      /*const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetToken = nanoid(64);
      await this.ResetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });*/
      const code = Math.floor(100000 + Math.random() * 900000);
      //Send the link to the user by email
      this.smsService.sendSms(phoneNumber, code);
      return {"number" :  phoneNumber ,"code": code, user};
    }

    return { message: 'If this user exists, they will receive an email' };
  }






  // async mail(){
  //   this.mailService.sendPasswordResetEmail("khaluiyesser@gmail.com", "hshshqs");
  // }

  async resetPassword(newPassword: string, resetToken: string) {
    //Find a valid reset token document
    const token = await this.ResetTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    //Change user password (MAKE SURE TO HASH!!)
    const user = await this.UserModel.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return user
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh Token is invalid');
    }
    return this.generateUserTokens(token.userId);
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '10h' });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: string) {
    // Calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.RefreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, token } },
      {
        upsert: true,
      },
    );
  }

  async getUserPermissions(userId: string) {
    const user = await this.UserModel.findById(userId);

    if (!user) throw new BadRequestException();

    const role = await this.rolesService.getRoleById(user.roleId.toString());
    return role.permissions;
  }
}
