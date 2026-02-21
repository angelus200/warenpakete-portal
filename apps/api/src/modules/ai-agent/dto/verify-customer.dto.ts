import { IsOptional, IsString } from 'class-validator';

export class VerifyCustomerDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  customer_id?: string;
}
