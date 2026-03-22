import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSellerApplicationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  adminNotes?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reviewedBy?: string;
}
