// Service Products - logic bisnis CRUD products
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../models/product.model';
import { Category } from '../../categories/models/category.model';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { QueryProductDto } from '../dto/query-product.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  // Ambil semua products dengan pagination, search, filter
  async findAll(query: QueryProductDto) {
    const { page = 1, limit = 10, search, categoryId } = query;
    const offset = (page - 1) * limit;

    // Bangun kondisi where
    const where: any = {};

    // Filter pencarian berdasarkan nama
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    // Filter berdasarkan category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const { rows, count } = await this.productModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']], // urutkan dari terbaru
      include: [
        {
          model: Category,
          attributes: ['id', 'name'], // hanya ambil id & nama category
        },
      ],
    });

    return {
      items: rows,
      meta: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // Ambil 1 product berdasarkan ID
  async findOne(id: number) {
    const product = await this.productModel.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!product) {
      throw new NotFoundException(`Product dengan ID ${id} tidak ditemukan`);
    }

    return product;
  }

  // Buat product baru
  async create(dto: CreateProductDto) {
    const product = await this.productModel.create(dto as any);
    return this.findOne(product.id); // return dengan data category
  }

  // Update product
  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    await product.update(dto);
    return this.findOne(id); // return data terbaru
  }

  // Hapus product
  async remove(id: number) {
    const product = await this.findOne(id);
    await product.destroy();
    return { message: 'Product berhasil dihapus' };
  }
}
