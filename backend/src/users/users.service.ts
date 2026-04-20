import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<UserDocument> {
    const { email, password, nombre, telefono } = createUserDto;
    
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
        throw new BadRequestException('El correo ya está en uso');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const createdUser = new this.userModel({
      email,
      passwordHash,
      nombre,
      telefono,
      rol: UserRole.CLIENTE
    });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async saveOtp(email: string, code: string): Promise<UserDocument | null> {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // Expira en 10 min
    return this.userModel.findOneAndUpdate(
      { email },
      { otpCode: code, otpExpires: expires },
      { new: true }
    ).exec();
  }

  async clearOtp(email: string): Promise<void> {
    await this.userModel.updateOne(
      { email },
      { $unset: { otpCode: 1, otpExpires: 1 } }
    ).exec();
  }
}
