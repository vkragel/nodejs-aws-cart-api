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
    return await this.orderRepository.find({
      relations: ['cart'],
    });
  }

  async findById(orderId: string): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: { id: orderId },
    });
  }

  async create(data: CreateOrderPayload): Promise<OrderEntity> {
    const id = randomUUID() as string;

    const order = await this.orderRepository.create({ ...data, id });

    return await this.dataSource.manager.transaction(async (tem) => {
      await tem.save(OrderEntity, order);
      await tem.update(
        CartEntity,
        { user_id: order.user_id },
        { status: CartStatus.OPEN },
      );
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
