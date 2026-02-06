// Module database - menghubungkan Sequelize ke MySQL + jalankan seeder
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InitialSeeder } from './seeders/initial.seeder';
import { User } from '../modules/users/models/user.model';
import { Category } from '../modules/categories/models/category.model';
import { Product } from '../modules/products/models/product.model';

@Module({
  imports: [
    // Gunakan forRootAsync agar .env terbaca dulu
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'test_coding_pt_dot'),
        autoLoadModels: true,
        synchronize: true,
        logging: false,
      }),
    }),
    SequelizeModule.forFeature([User, Category, Product]), // register model untuk seeder
  ],
  providers: [InitialSeeder], // jalankan seeder otomatis saat start
})
export class DatabaseModule {}
