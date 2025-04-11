import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'integer', default: 100 })
  count: number;
}
