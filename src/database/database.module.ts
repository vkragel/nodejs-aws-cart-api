import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from '../../constants/credentials';
import { CartEntity } from '../cart/models/cart.entity';
import { CartItemEntity } from '../cart/models/cart-item.entity';
import { UserEntity } from 'src/users/models/user.entity';
import { OrderEntity } from 'src/order';
import { ProductEntity } from 'src/cart/models/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: Number(DB_PORT) || 5432,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [
        CartEntity,
        CartItemEntity,
        UserEntity,
        ProductEntity,
        OrderEntity,
      ],
    }),
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemEntity,
      ProductEntity,
      OrderEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
