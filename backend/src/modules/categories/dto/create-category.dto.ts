// DTO untuk membuat category baru
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Nama kategori' })
  @IsString()
  @IsNotEmpty({ message: 'Nama kategori wajib diisi' })
  name: string;

  @ApiPropertyOptional({
    example: 'Electronic devices and gadgets',
    description: 'Deskripsi kategori',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
