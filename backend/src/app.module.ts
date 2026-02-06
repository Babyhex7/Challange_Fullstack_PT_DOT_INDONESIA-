// Module utama - gabungkan semua module yang ada
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // baca file .env
    DatabaseModule, // koneksi database
    AuthModule, // modul autentikasi
    UsersModule, // modul users
    CategoriesModule, // modul categories
    ProductsModule, // modul products
  ],
})
export class AppModule {}
