import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PutCartPayload } from 'src/order/type';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity, CartStatus } from 'src/cart/models/cart.entity';
import { CartItemEntity } from 'src/cart/models/cart-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {}

  async findByUserId(userId: string): Promise<CartEntity> {
    const openedCart = await this.cartRepository
      .createQueryBuilder('carts')
      .leftJoinAndSelect('carts.items', 'cart_items')
      .where('carts.user_id = :userId', { userId })
      .andWhere('carts.status = :status', { status: CartStatus.OPEN })
      .getOne();

    if (!openedCart) return null;

    return openedCart;
  }

  async createByUserId(userId: string): Promise<CartEntity> {
    const id = randomUUID();

    const newCart = new CartEntity();

    newCart.id = id;
    newCart.user_id = userId;
    newCart.status = CartStatus.OPEN;

    await this.cartRepository.save(newCart);

    newCart.items = [];

    return newCart;
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async findExistingCartItem(
    cart_id: string,
    product_id: string,
  ): Promise<CartItemEntity | undefined> {
    return await this.cartItemRepository.findOne({
      where: { cart_id, product_id },
    });
  }

  async addOrUpdateCartItem(
    cartId: string,
    productId: string,
    count: number,
  ): Promise<void> {
    const existingItem = await this.findExistingCartItem(cartId, productId);

    if (existingItem) {
      existingItem.count = count;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart_id: cartId,
        product_id: productId,
        count: count,
      });
      await this.cartItemRepository.save(newItem);
    }
  }

  async removeCartItem(item: CartItemEntity): Promise<void> {
    await this.cartItemRepository.remove(item);
  }

  async updateByUserId(
    userId: string,
    payload: PutCartPayload,
  ): Promise<CartEntity> {
    const userCart = await this.findOrCreateByUserId(userId);

    const existingItem = await this.findExistingCartItem(
      userCart.id,
      payload.product.id,
    );

    if (payload.count > 0) {
      await this.addOrUpdateCartItem(
        userCart.id,
        payload.product.id,
        payload.count,
      );
    } else if (payload.count === 0 && existingItem) {
      await this.removeCartItem(existingItem);
    }

    return await this.findByUserId(userId);
  }

  async removeByUserId(userId: string): Promise<CartEntity> {
    const cart = await this.cartRepository.findOne({
      where: { user_id: userId },
    });

    const result = await this.cartRepository.remove(cart);

    return result;
  }
}
