import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderModule } from 'src/order';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { CartEntity } from './models/cart.entity';
import { CartItemEntity } from './models/cart-item.entity';
import { ProductEntity } from './models/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItemEntity, CartEntity, ProductEntity]),
    OrderModule,
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
