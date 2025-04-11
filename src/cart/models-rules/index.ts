import { CartItemEntity } from '../models/cart-item.entity';

export function calculateCartTotal(items: CartItemEntity[]): number {
  return items.length
    ? items.reduce(
        (acc: number, { product: { price }, count }: CartItemEntity) => {
          return (acc += price * count);
        },
        0,
      )
    : 0;
}
