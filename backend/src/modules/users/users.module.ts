// Module User - register model, service, controller
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])], // register model User
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // export agar bisa dipakai module lain (Auth)
})
export class UsersModule {}
