// Module database - menghubungkan Sequelize ke MySQL
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from '../config/database.config';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig()), // koneksi ke MySQL
  ],
})
export class DatabaseModule {}
