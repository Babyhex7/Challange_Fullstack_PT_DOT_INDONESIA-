// Service User - logic bisnis untuk user
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // Cari user berdasarkan email (untuk login)
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  // Cari user berdasarkan ID
  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] }, // jangan tampilkan password
    });
  }

  // Buat user baru dengan hash password
  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.userModel.create({
      ...dto,
      password: hashedPassword,
    } as any);
  }
}
