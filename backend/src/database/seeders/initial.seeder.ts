// Seeder - isi data awal ke database (admin user, categories, products)
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../modules/users/models/user.model';
import { Category } from '../../modules/categories/models/category.model';
import { Product } from '../../modules/products/models/product.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InitialSeeder implements OnModuleInit {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Category) private categoryModel: typeof Category,
    @InjectModel(Product) private productModel: typeof Product,
  ) {}

  // Jalankan otomatis saat module dimuat
  async onModuleInit() {
    await this.seedUsers();
    await this.seedCategories();
    await this.seedProducts();
  }

  // Seed user admin default
  private async seedUsers() {
    const count = await this.userModel.count();
    if (count > 0) return; // skip kalau sudah ada data

    const hashedPassword = await bcrypt.hash('password123', 10);
    await this.userModel.create({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      isActive: true,
    } as any);

    console.log('✅ Seeder: User admin berhasil dibuat');
  }

  // Seed categories contoh
  private async seedCategories() {
    const count = await this.categoryModel.count();
    if (count > 0) return;

    const categories = [
      { name: 'Electronics', description: 'Perangkat elektronik dan gadget' },
      { name: 'Clothing', description: 'Pakaian dan aksesoris fashion' },
      { name: 'Books', description: 'Buku dan materi bacaan' },
      { name: 'Food & Beverages', description: 'Makanan dan minuman' },
      { name: 'Sports', description: 'Perlengkapan olahraga' },
    ];

    await this.categoryModel.bulkCreate(categories as any[]);
    console.log('✅ Seeder: Categories berhasil dibuat');
  }

  // Seed products contoh
  private async seedProducts() {
    const count = await this.productModel.count();
    if (count > 0) return;

    const products = [
      // Electronics (categoryId: 1)
      { categoryId: 1, name: 'MacBook Pro M3', description: 'Laptop Apple dengan chip M3', price: 25000000, stock: 15 },
      { categoryId: 1, name: 'iPhone 15 Pro', description: 'Smartphone Apple terbaru', price: 18000000, stock: 30 },
      { categoryId: 1, name: 'Samsung Galaxy S24', description: 'Smartphone Samsung flagship', price: 14000000, stock: 25 },
      { categoryId: 1, name: 'iPad Air', description: 'Tablet Apple untuk produktivitas', price: 9000000, stock: 20 },
      // Clothing (categoryId: 2)
      { categoryId: 2, name: 'Kaos Polos Premium', description: 'Kaos cotton combed 30s', price: 89000, stock: 100 },
      { categoryId: 2, name: 'Jaket Hoodie', description: 'Hoodie fleece tebal', price: 199000, stock: 50 },
      { categoryId: 2, name: 'Celana Jeans Slim', description: 'Celana jeans stretch slim fit', price: 259000, stock: 40 },
      // Books (categoryId: 3)
      { categoryId: 3, name: 'Clean Code', description: 'Buku tentang menulis kode yang bersih', price: 150000, stock: 20 },
      { categoryId: 3, name: 'Design Patterns', description: 'Pola desain dalam pemrograman', price: 175000, stock: 15 },
      // Food (categoryId: 4)
      { categoryId: 4, name: 'Kopi Arabica 250g', description: 'Biji kopi arabica premium', price: 85000, stock: 60 },
      { categoryId: 4, name: 'Teh Hijau Organik', description: 'Teh hijau organik 100 sachet', price: 45000, stock: 80 },
      // Sports (categoryId: 5)
      { categoryId: 5, name: 'Sepatu Running Nike', description: 'Sepatu lari Nike Air Zoom', price: 1500000, stock: 25 },
      { categoryId: 5, name: 'Yoga Mat Premium', description: 'Matras yoga anti slip 6mm', price: 250000, stock: 35 },
    ];

    await this.productModel.bulkCreate(products as any[]);
    console.log('✅ Seeder: Products berhasil dibuat');
  }
}
