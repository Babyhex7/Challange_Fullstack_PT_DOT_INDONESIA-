// DTO untuk membuat product baru
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 1, description: 'ID kategori' })
  @Type(() => Number)
  @IsInt({ message: 'Category ID harus integer' })
  @IsNotEmpty({ message: 'Category ID wajib diisi' })
  categoryId: number;

  @ApiProperty({ example: 'MacBook Pro', description: 'Nama produk' })
  @IsString()
  @IsNotEmpty({ message: 'Nama produk wajib diisi' })
  name: string;

  @ApiPropertyOptional({
    example: 'Apple laptop with M3 chip',
    description: 'Deskripsi produk',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 25000000, description: 'Harga produk' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @IsNotEmpty({ message: 'Harga wajib diisi' })
  @Min(0, { message: 'Harga tidak boleh negatif' })
  price: number;

  @ApiPropertyOptional({ example: 50, description: 'Stok produk' })
  @Type(() => Number)
  @IsInt({ message: 'Stok harus integer' })
  @IsOptional()
  @Min(0, { message: 'Stok tidak boleh negatif' })
  stock?: number;
}
