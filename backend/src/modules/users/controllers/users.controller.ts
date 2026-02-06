// Controller User - handle request HTTP untuk user
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/profile - ambil data profil user yang login
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }
}
