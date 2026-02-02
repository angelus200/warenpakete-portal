import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContractDto {
  @ApiProperty({ required: false, enum: ['pending', 'listed', 'sold'] })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'listed', 'sold'])
  salesStatus?: string;

  @ApiProperty({ required: false, example: 6500.00 })
  @IsOptional()
  @IsNumber()
  salesPrice?: number;
}
