// DTO untuk query parameter categories (pagination & search)
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCategoryDto {
  @ApiPropertyOptional({ example: 1, description: 'Halaman ke-' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Jumlah data per halaman' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'electronics', description: 'Kata kunci pencarian' })
  @IsOptional()
  @IsString()
  search?: string;
}
