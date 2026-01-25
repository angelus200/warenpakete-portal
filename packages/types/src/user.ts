export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  clerkId: string;
  email: string;
  name?: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  role?: UserRole;
}
