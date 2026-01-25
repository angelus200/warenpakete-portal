export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  active?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  active?: boolean;
}
