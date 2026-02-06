// Service Categories - logic bisnis CRUD categories
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../models/category.model';
import { Product } from '../../products/models/product.model';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { QueryCategoryDto } from '../dto/query-category.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  // Ambil semua categories dengan pagination & search
  async findAll(query: QueryCategoryDto) {
    const { page = 1, limit = 10, search } = query;
    const offset = (page - 1) * limit;

    // Filter pencarian berdasarkan nama
    const where = search
      ? { name: { [Op.like]: `%${search}%` } }
      : {};

    const { rows, count } = await this.categoryModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']], // urutkan dari terbaru
      attributes: {
        include: [
          // Hitung jumlah products per category
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM products WHERE products.category_id = `Category`.`id`)',
            ),
            'productsCount',
          ],
        ],
      },
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

  // Ambil 1 category berdasarkan ID (include products)
  async findOne(id: number) {
    const category = await this.categoryModel.findByPk(id, {
      include: [{ model: Product }],
    });

    if (!category) {
      throw new NotFoundException(`Category dengan ID ${id} tidak ditemukan`);
    }

    return category;
  }

  // Buat category baru
  async create(dto: CreateCategoryDto) {
    return this.categoryModel.create(dto as any);
  }

  // Update category
  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    return category.update(dto);
  }

  // Hapus category
  async remove(id: number) {
    const category = await this.findOne(id);
    await category.destroy();
    return { message: 'Category berhasil dihapus' };
  }
}
