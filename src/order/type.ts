export enum OrderStatus {
  Open = 'OPEN',
  Approved = 'APPROVED',
  Confirmed = 'CONFIRMED',
  Sent = 'SENT',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
}

export type Address = {
  address: string;
  firstName: string;
  lastName: string;
  comment: string;
};
export type CreateOrderDto = {
  items: Array<{ productId: string; count: 1 }>;
  address: {
    comment: string;
    address: string;
    lastName: string;
    firstName: string;
  };
};

export type PutCartPayload = {
  product: { description: string; id: string; title: string; price: number };
  count: number;
};
export type CreateOrderPayload = {
  user_id: string;
  cart_id: string;
  items: Array<{ product_id: string; count: number }>;
  address: Address;
  total: number;
};
