import { CartItemEntity } from '../models/cart-item.entity';

export function calculateCartTotal(items: CartItemEntity[]): number {
  return items.length
    ? items.reduce((acc: number, { count }: CartItemEntity) => {
        return (acc += count);
      }, 0)
    : 0;
}
