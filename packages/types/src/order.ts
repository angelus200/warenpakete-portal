export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  stripePaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

export interface CreateOrderDto {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  stripePaymentId?: string;
}
