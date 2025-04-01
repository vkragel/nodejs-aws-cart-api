import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateOrderPayload } from '../type';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../models/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CartEntity, CartStatus } from 'src/cart';

@Injectable()
export class OrderService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async getAll(): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      relations: ['cart', 'cart.items'],
    });

    return orders.map((order) => {
      return { ...order, items: order.cart?.items };
    });
  }

  async findById(orderId: string): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: { id: orderId },
    });
  }

  async create(data: CreateOrderPayload): Promise<OrderEntity> {
    return await this.dataSource.manager.transaction(async (tem) => {
      const order = tem.create(OrderEntity, { ...data, id: randomUUID() });

      await tem.save(order);

      await tem.update(
        CartEntity,
        { id: data.cart_id },
        { status: CartStatus.ORDERED },
      );

      const cart = await tem.findOne(CartEntity, {
        where: { id: data.cart_id },
        relations: ['items'],
      });

      order['items'] = cart?.items || [];

      return order;
    });
  }

  async update(
    orderId: string,
    data: Partial<OrderEntity>,
  ): Promise<OrderEntity> {
    await this.orderRepository.update(orderId, data);

    return await this.findById(orderId);
  }
}
