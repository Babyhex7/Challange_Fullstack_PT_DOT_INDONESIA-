// Module Products - register model, service, controller
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';

@Module({
  imports: [SequelizeModule.forFeature([Product])], // register model Product
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
