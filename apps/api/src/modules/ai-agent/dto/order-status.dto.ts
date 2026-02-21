import { IsOptional, IsString } from 'class-validator';

export class OrderStatusDto {
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  order_id?: string;
}
