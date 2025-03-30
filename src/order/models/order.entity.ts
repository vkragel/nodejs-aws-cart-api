import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../type';
import { CartEntity } from 'src/cart';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'uuid', nullable: false })
  cart_id: string;

  @Column({ type: 'json' })
  payment: { type: string; address?: any; creditCard?: any };

  @Column({ type: 'json' })
  delivery: { type: string; address: any };

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Open })
  status: OrderStatus;

  @Column({ type: 'integer' })
  total: number;

  @ManyToOne(() => CartEntity, (cart) => cart.orders, { onDelete: 'CASCADE' })
  cart: CartEntity;
}
