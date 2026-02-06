// Service Auth - logic login & register
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Login - cek email & password, return token
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // Cek apakah user ada
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Cek password cocok atau tidak
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // Register - buat user baru
  async register(dto: RegisterDto) {
    // Cek apakah email sudah terdaftar
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const user = await this.usersService.create(dto);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  // Get profile user yang sedang login
  async getProfile(userId: number) {
    return this.usersService.findById(userId);
  }
}
