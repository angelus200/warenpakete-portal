import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { CommissionStatus } from '@prisma/client';

export class CreateCommissionDto {
  @ApiProperty({ description: 'Order ID' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Reseller User ID' })
  @IsString()
  resellerId: string;

  @ApiProperty({ description: 'Commission amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    enum: CommissionStatus,
    default: CommissionStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(CommissionStatus)
  status?: CommissionStatus;
}
