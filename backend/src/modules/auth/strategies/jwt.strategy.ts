// JWT Strategy - validasi token JWT dari header Authorization
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ambil token dari header
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'super_secret_key'),
    });
  }

  // Validasi payload token, return user data
  async validate(payload: { sub: number; email: string }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }
    return { id: payload.sub, email: payload.email };
  }
}
