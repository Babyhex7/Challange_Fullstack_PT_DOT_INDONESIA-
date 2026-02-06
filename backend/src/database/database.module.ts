// Module database - menghubungkan Sequelize ke MySQL + jalankan seeder
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from '../config/database.config';
import { InitialSeeder } from './seeders/initial.seeder';
import { User } from '../modules/users/models/user.model';
import { Category } from '../modules/categories/models/category.model';
import { Product } from '../modules/products/models/product.model';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig()), // koneksi ke MySQL
    SequelizeModule.forFeature([User, Category, Product]), // register model untuk seeder
  ],
  providers: [InitialSeeder], // jalankan seeder otomatis saat start
})
export class DatabaseModule {}
