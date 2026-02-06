// Model Product - representasi tabel 'products' di database
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Category } from '../../categories/models/category.model';

@Table({ tableName: 'products', timestamps: true })
export class Product extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  // Foreign key ke tabel categories
  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'category_id',
  })
  declare categoryId: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare stock: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  })
  declare isActive: boolean;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;

  // Relasi: product milik 1 category
  @BelongsTo(() => Category)
  category: Category;
}
