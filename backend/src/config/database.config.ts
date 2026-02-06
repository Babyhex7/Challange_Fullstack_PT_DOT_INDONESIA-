// Konfigurasi koneksi database Sequelize ke MySQL
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig = (): SequelizeModuleOptions => ({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'admin_panel',
  autoLoadModels: true, // otomatis load semua model
  synchronize: true, // sync model ke tabel (dev only)
  logging: false,
});
