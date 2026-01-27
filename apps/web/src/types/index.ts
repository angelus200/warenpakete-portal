export enum UserRole {
  BUYER = 'BUYER',
  RESELLER = 'RESELLER',
  ADMIN = 'ADMIN',
}

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum CommissionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  vatId?: string;
  role: UserRole;
  walletBalance: number;
  referralCode?: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  retailValue: number;
  stock: number;
  palletCount: number;
  status: ProductStatus;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  stripePaymentId?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
}

export interface Commission {
  id: string;
  orderId: string;
  resellerId: string;
  amount: number;
  status: CommissionStatus;
  paidAt?: string;
  createdAt: string;
  order?: Order;
  reseller?: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CommissionEarnings {
  total: number;
  paid: number;
  pending: number;
}
